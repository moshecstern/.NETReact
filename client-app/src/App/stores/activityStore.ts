import { SyntheticEvent } from "react";
import {
    observable,
    action,
    computed,
    // makeAutoObservable,
    // reaction,
    runInAction,
} from "mobx";
// import { IActivity } from "../models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import {RootStore} from './rootStore';
import { createAttendee, setActivityProps } from "../common/util/util";
import { IActivity } from "../models/activity";
// import { act } from 'react-dom/test-utils';


export default class ActivityStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        // makeAutoObservable(this);
        // reaction(
        //     () => this.predicate.keys(),
        //     () => {
        //       this.page = 0;
        //       this.activityRegistry.clear();
        //       this.loadActivities();
        //     }
        //   )
    }
    @observable activityRegistry = new Map();
    // @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null;
    // @observable editMode = false;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;

    @computed get activitiesByDate() {
        // return this.activities.slice().sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        return this.groupActivitiesByDate(
            Array.from(this.activityRegistry.values())
        );
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.toISOString().split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];
                return activities;
            }, {} as { [key: string]: IActivity[] })
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                 setActivityProps(activity, this.rootStore.userStore.user!)
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
            console.log(this.groupActivitiesByDate(activities));
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
            console.log(error);
        }
    };
    // Promise way of getting results
    //     agent.Activities.list()
    //     .then(activites => {
    //         activites.forEach((activity) => {
    //             activity.date = activity.date.split('.')[0]
    //             this.activities.push(activity)
    //         })
    //     })
    //     .catch(error => console.log(error))
    //     .finally(() => this.loadingInitial = false);

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity, this.rootStore.userStore.user!)
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
                });
                console.log(error);
                // throw error;
            }
        }
    };
    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    @action clearActivity = () => {
        this.activity = null;
    };
    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            // this.activities.push(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.isHost = true;
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem Submitting Data');
            console.log(error.response)
        }
    };
    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`);
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            console.log(error.response);
            toast.error('Problem Submitting Data');
        }
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            });
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = "";
            });
            console.log(error);
        }
    };

    @action attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
          await agent.Activities.attend(this.activity!.id);
          runInAction(() => {
            if (this.activity) {
              this.activity.attendees.push(attendee);
              this.activity.isGoing = true;
              this.activityRegistry.set(this.activity.id, this.activity);
              this.loading = false;
            }
          })
        } catch (error) {
          runInAction(() => {
            this.loading = false;
          })
          toast.error('Problem signing up to activity');
        }
      };
    
      @action cancelAttendance = async () => {
        this.loading = true;
        try {
          await agent.Activities.unattend(this.activity!.id);
          runInAction(() => {
            if (this.activity) {
              this.activity.attendees = this.activity.attendees.filter(
                a => a.username !== this.rootStore.userStore.user!.username
              );
              this.activity.isGoing = false;
              this.activityRegistry.set(this.activity.id, this.activity);
              this.loading = false;
            }
          })
        } catch (error) {
          runInAction(() => {
            this.loading = false;
          })
          toast.error('Problem cancelling attendance');
        }
      };
}
