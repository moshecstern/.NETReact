import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IExperience } from '../models/experience';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
// import { createAttendee } from '../common/util/util';
// import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import { setExperienceProps } from '../common/util/util';

const LIMIT = 2;


export default class experienceStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.experienceRegistry.clear();
        this.loadExperiences();
      }
    )
  }

  @observable experienceRegistry = new Map();
  @observable experience: IExperience | null = null;
  @observable loadingInitialExperience = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
//   @observable.ref hubConnection: HubConnection | null = null;
  @observable experienceCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== 'all') {
      this.predicate.set(predicate, value);
    }
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPages() {
    return Math.ceil(this.experienceCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  }

//   @action createHubConnection = (experienceId: string) => {
//     this.hubConnection = new HubConnectionBuilder()
//       .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
//         accessTokenFactory: () => this.rootStore.commonStore.token!
//       })
//       .configureLogging(LogLevel.Information)
//       .build();

//     this.hubConnection
//       .start()
//       .then(() => console.log(this.hubConnection!.state))
//       .then(() => {
//         console.log('Attempting to join group');
//         this.hubConnection!.invoke('AddToGroup', experienceId)
//       })
//       .catch(error => console.log('Error establishing connection: ', error));

//     this.hubConnection.on('ReceiveComment', comment => {
//       runInAction(() => {
//         this.experience!.comments.push(comment)
//       })
//     })

//     this.hubConnection.on('Send', message => {
//       toast.info(message);
//     })
//   };

//   @action stopHubConnection = () => {
//     this.hubConnection!.invoke('RemoveFromGroup', this.experience!.id)
//       .then(() => {
//         this.hubConnection!.stop()
//       })
//       .then(() => console.log('Connection stopped'))
//       .catch(err => console.log(err))
//   }

//   @action addComment = async (values: any) => {
//     values.experienceId = this.experience!.id;
//     try {
//       await this.hubConnection!.invoke('SendComment', values)
//     } catch (error) {
//       console.log(error);
//     }
//   } 


  @computed get experiencesByDate() {
    return this.groupexperiencesByDate(
      Array.from(this.experienceRegistry.values())
    );
  }

  groupexperiencesByDate(experiences: IExperience[]) {
    const sortedexperiences = experiences.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedexperiences.reduce(
        (experiences, experience) => {
          const date = experience.date.toISOString().split('T')[0];
          experiences[date] = experiences[date]
            ? [...experiences[date], experience]
            : [experience];
          return experiences;
        },
        {} as { [key: string]: IExperience[] }
      )
    );
  }

  @action loadExperiences = async () => {
    this.loadingInitialExperience = true;
    try {
      const experienceEnvelope = await agent.Experiences.list(this.axiosParams);
      const {experiences, experienceCount} = experienceEnvelope;
      runInAction('loading experiences', () => {
        experiences.forEach(experience => {
          setExperienceProps(experience, this.rootStore.userStore.user!);
          this.experienceRegistry.set(experience.id, experience);
        });
        this.experienceCount = experienceCount;
        this.loadingInitialExperience = false;
      });
    } catch (error) {
      runInAction('load experience error', () => {
        this.loadingInitialExperience = false;
      });
    }
  };

  @action loadExperience = async (id: string) => {
    let experience = this.getExperience(id);
    if (experience) {
      this.experience = experience;
      return toJS(experience);
    } else {
      this.loadingInitialExperience = true;
      try {
        experience = await agent.Experiences.details(id);
        runInAction('getting experience', () => {
        //   setexperienceProps(experience, this.rootStore.userStore.user!);
          this.experience = experience;
          this.experienceRegistry.set(experience.id, experience);
          this.loadingInitialExperience = false;
        });
        return experience;
      } catch (error) {
        runInAction('get experience error', () => {
          this.loadingInitialExperience = false;
        });
        console.log(error);
      }
    }
  };

  @action clearExperience = () => {
    this.experience = null;
  };

  getExperience = (id: string) => {
    return this.experienceRegistry.get(id);
  };

  @action createExperience = async (experience: IExperience) => {
    this.submitting = true;
    try {
      await agent.Experiences.create(experience);
      // const attendee = createAttendee(this.rootStore.userStore.user!);
      // attendee.isHost = true;
      // let attendees = [];
      // attendees.push(attendee);
      // experience.Applied = attendees;
      experience.isHost = true;
      runInAction('create experience', () => {
        this.experienceRegistry.set(experience.id, experience);
        this.submitting = false;
      });
      history.push(`/experiences/${experience.id}`);
    } catch (error) {
      runInAction('create experience error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editExperience = async (experience: IExperience) => {
    this.submitting = true;
    try {
      await agent.Experiences.update(experience);
      runInAction('editing experience', () => {
        this.experienceRegistry.set(experience.id, experience);
        this.experience = experience;
        this.submitting = false;
      });
      history.push(`/experiences/${experience.id}`);
    } catch (error) {
      runInAction('edit experience error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteExperience = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Experiences.delete(id);
      runInAction('deleting experience', () => {
        this.experienceRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete experience error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

 


}
