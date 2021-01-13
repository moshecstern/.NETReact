import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IJob } from '../models/jobs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createApplicant, setJobProps } from '../common/util/util';
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
        this.loadJobs();
      }
    )
  }

  @observable jobRegistry = new Map();
  @observable job: IJob | null = null;
  @observable loadingInitialJob = false;
  @observable submittingJob = false;
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

  groupjobsByDate(jobs: IJob[]) {
    console.log("grouping by date " + jobs);
    
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
        {} as { [key: string]: IJob[] }
      )
    );
  }

  @action loadJobs = async () => {
    this.loadingInitialJob = true;
    try {
      const jobsEnvelope = await agent.Jobs.list(this.axiosParams);
      const {jobs, jobCount} = jobsEnvelope;
      console.log("This is how many are comming back * " +jobCount+" * these are the jobs coming back"+ jobs)
      console.log(jobs)
      runInAction(() => {
        jobs.forEach(job => {
          setJobProps(job, this.rootStore.userStore.user!);
          this.jobRegistry.set(job.id, job);
           console.log(jobs)
        console.log("jobs after");
        });
       
        this.jobCount = jobCount;
        this.loadingInitialJob = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialJob = false;
      });
    }
  };

  @action loadJob = async (id: string) => {
    let job = this.getjob(id);
    if (job) {
      this.job = job;
      return toJS(job);
    } else {
      this.loadingInitialJob = true;
      try {
        job = await agent.Jobs.details(id);
        runInAction(() => {
          setJobProps(job, this.rootStore.userStore.user!);
          this.job = job;
          this.jobRegistry.set(job.id, job);
          this.loadingInitialJob = false;
        });
        return job;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialJob = false;
        });
        console.log(error);
      }
    }
  };

  @action clearjob = () => {
    this.job = null;
  };

  getjob = (id: string) => {
    console.log(id)
    return this.jobRegistry.get(id);
  };

  @action createJob = async (job: IJob) => {
    this.submittingJob = true;
    try {
      await agent.Jobs.create(job);
      const attendee = createApplicant(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      job.applied = attendees;
      job.isHost = true;
      runInAction(() => {
        this.jobRegistry.set(job.id, job);
        this.submittingJob = false;
      });
      history.push(`/jobs/${job.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingJob = false;
      });
      toast.error('Problem submittingJob data');
      console.log(error.response);
    }
  };

  @action editJob = async (job: IJob) => {
    this.submittingJob = true;
    try {
      await agent.Jobs.update(job);
      runInAction(() => {
        this.jobRegistry.set(job.id, job);
        this.job = job;
        this.submittingJob = false;
      });
      history.push(`/jobs/${job.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingJob = false;
      });
      toast.error('Problem submittingJob data');
      console.log(error);
    }
  };

  @action deletejob = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingJob = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Jobs.delete(id);
      runInAction(() => {
        this.jobRegistry.delete(id);
        this.submittingJob = false;
        this.target = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingJob = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action applyjob = async () => {
    const attendee = createApplicant(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Jobs.apply(this.job!.id);
      runInAction(() => {
        if (this.job) {
          this.job.applied.push(attendee);
          this.job.isApplied = true;
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
          this.job.applied = this.job.applied.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.job.isApplied = false;
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
