import { observable, computed, action, makeAutoObservable } from "mobx";
import { IUser, IUserFormValues } from "../Models/user";
import agent from "../api/agent";
import {RootStore} from './rootStore';

export default class UserStore {
        rootStore: RootStore;
        constructor(rootStore: RootStore) {
            this.rootStore = rootStore;
            makeAutoObservable(this);
        }
    @observable user: IUser | null = null;

    @computed get isLoggedIn() {return !!this.user}

    @action login = async (values: IUserFormValues) => {
        try{
            const user = await agent.User.login(values);
            this.user = user;
        } catch (error) {
            console.log(error);
        }
    }
}