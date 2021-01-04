import { createContext, SyntheticEvent } from "react";
import {
    observable,
    action,
    computed,
    makeAutoObservable,
    configure,
    runInAction,
} from "mobx";
import { IActivity } from "../Models/activity";
import agent from "../api/agent";
import { history } from "../..";
import { toast } from "react-toastify";
import {RootStore} from './rootStore';
// import { act } from 'react-dom/test-utils';

configure({ enforceActions: "always" });

export default class ActivityStore {
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }
    @observable activityRegistry = new Map();
    // @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null;
    // @observable editMode = false;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = "";

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
                    activity.date = new Date(activity.date);
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
                    activity.date = new Date(activity.date)
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
}
