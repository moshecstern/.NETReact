import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IJobs } from '../models/jobs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createAttendee, setJobProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class jobStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.jobRegistry.clear();
        this.loadjobs();
      }
    )
  }

  @observable jobRegistry = new Map();
  @observable job: IJobs | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable jobCount = 0;
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
    return Math.ceil(this.jobCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  }

  @action createHubConnection = (jobId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnection!.invoke('AddToGroup', jobId)
      })
      .catch(error => console.log('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.job!.comments.push(comment)
      })
    })

    this.hubConnection.on('Send', message => {
      toast.info(message);
    })
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.job!.id)
      .then(() => {
        this.hubConnection!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addComment = async (values: any) => {
    values.jobId = this.job!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values)
    } catch (error) {
      console.log(error);
    }
  } 


  @computed get jobsByDate() {
    return this.groupjobsByDate(
      Array.from(this.jobRegistry.values())
    );
  }

  groupjobsByDate(jobs: IJobs[]) {
    const sortedjobs = jobs.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedjobs.reduce(
        (jobs, job) => {
          const date = job.date.toISOString().split('T')[0];
          jobs[date] = jobs[date]
            ? [...jobs[date], job]
            : [job];
          return jobs;
        },
        {} as { [key: string]: IJobs[] }
      )
    );
  }

  @action loadjobs = async () => {
    this.loadingInitial = true;
    try {
      const jobsEnvelope = await agent.Jobs.list(this.axiosParams);
      const {jobs, JobsCount} = jobsEnvelope;
      runInAction('loading jobs', () => {
        jobs.forEach(job => {
          setJobProps(job, this.rootStore.userStore.user!);
          this.jobRegistry.set(job.id, job);
        });
        this.jobCount = JobsCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load jobs error', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadjob = async (id: string) => {
    let job = this.getjob(id);
    if (job) {
      this.job = job;
      return toJS(job);
    } else {
      this.loadingInitial = true;
      try {
        job = await agent.Jobs.details(id);
        runInAction('getting job', () => {
          setJobProps(job, this.rootStore.userStore.user!);
          this.job = job;
          this.jobRegistry.set(job.id, job);
          this.loadingInitial = false;
        });
        return job;
      } catch (error) {
        runInAction('get job error', () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearjob = () => {
    this.job = null;
  };

  getjob = (id: string) => {
    return this.jobRegistry.get(id);
  };

  @action createjob = async (job: IJobs) => {
    this.submitting = true;
    try {
      await agent.Jobs.create(job);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      job.Applied = attendees;
      job.isHost = true;
      runInAction('create job', () => {
        this.jobRegistry.set(job.id, job);
        this.submitting = false;
      });
      history.push(`/jobs/${job.id}`);
    } catch (error) {
      runInAction('create job error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editjob = async (job: IJobs) => {
    this.submitting = true;
    try {
      await agent.Jobs.update(job);
      runInAction('editing job', () => {
        this.jobRegistry.set(job.id, job);
        this.job = job;
        this.submitting = false;
      });
      history.push(`/jobs/${job.id}`);
    } catch (error) {
      runInAction('edit job error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deletejob = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Jobs.delete(id);
      runInAction('deleting job', () => {
        this.jobRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete job error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action applyjob = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Jobs.apply(this.job!.id);
      runInAction(() => {
        if (this.job) {
          this.job.Applied.push(attendee);
          this.job.appliedbool = true;
          this.jobRegistry.set(this.job.id, this.job);
          this.loading = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error('Problem signing up to job');
    }
  };

  @action unlikeJob = async () => {
    this.loading = true;
    try {
      await agent.Jobs.unapply(this.job!.id);
      runInAction(() => {
        if (this.job) {
          this.job.Applied = this.job.Applied.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.job.appliedbool = false;
          this.jobRegistry.set(this.job.id, this.job);
          this.loading = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
