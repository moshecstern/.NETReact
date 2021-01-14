import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IJob } from '../models/jobs';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createApplicant, setJobProps } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const LIMIT = 2;


export default class jobStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicateJob.keys(),
      () => {
        this.pageJob = 0;
        this.jobRegistry.clear();
        this.loadJobs();
      }
    )
  }

  @observable jobRegistry = new Map();
  @observable job: IJob | null = null;
  @observable loadingInitialJob = false;
  @observable submittingJob = false;
  @observable targetJob = '';
  @observable loadingJob = false;
  @observable.ref hubConnectionJob: HubConnection | null = null;
  @observable jobCount = 0;
  @observable pageJob = 0;
  @observable predicateJob = new Map();

  @action setpredicateJob = (predicateJob: string, value: string | Date) => {
    this.predicateJob.clear();
    if (predicateJob !== 'all') {
      this.predicateJob.set(predicateJob, value);
    }
  }

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pageJob ? this.pageJob * LIMIT : 0}`);
    this.predicateJob.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalpageJobs() {
    return Math.ceil(this.jobCount / LIMIT);
  }

  @action setpageJob = (pageJob: number) => {
    this.pageJob = pageJob;
  }
  @action createHubConnectionJob = (jobId: string) => {
    this.hubConnectionJob = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_JOBCHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionJob
      .start()
      .then(() => console.log(this.hubConnectionJob!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionJob!.invoke('AddToGroupJob', jobId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
// below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionJob.on('ReceiveJobComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.job!.jobComments.push(comment)
      })
    })

    this.hubConnectionJob.on('SendJob', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionJob = () => {
    this.hubConnectionJob!.invoke('RemoveFromGroupJob', this.job!.id)
      .then(() => {
        this.hubConnectionJob!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentJob = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.jobId = this.job!.id;
    try {
      await this.hubConnectionJob!.invoke('SendCommentJob', values)
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
      const { jobs, jobCount } = jobsEnvelope;
      console.log("This is how many are comming back * " + jobCount + " * these are the jobs coming back" + jobs)
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
    this.targetJob = event.currentTarget.name;
    try {
      await agent.Jobs.delete(id);
      runInAction(() => {
        this.jobRegistry.delete(id);
        this.submittingJob = false;
        this.targetJob = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingJob = false;
        this.targetJob = '';
      });
      console.log(error);
    }
  };

  @action applyjob = async () => {
    const attendee = createApplicant(this.rootStore.userStore.user!);
    this.loadingJob = true;
    try {
      await agent.Jobs.apply(this.job!.id);
      runInAction(() => {
        if (this.job) {
          this.job.applied.push(attendee);
          this.job.isApplied = true;
          this.jobRegistry.set(this.job.id, this.job);
          this.loadingJob = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingJob = false;
      })
      toast.error('Problem signing up to job');
    }
  };

  @action unlikeJob = async () => {
    this.loadingJob = true;
    try {
      await agent.Jobs.unapply(this.job!.id);
      runInAction(() => {
        if (this.job) {
          this.job.applied = this.job.applied.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.job.isApplied = false;
          this.jobRegistry.set(this.job.id, this.job);
          this.loadingJob = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingJob = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
