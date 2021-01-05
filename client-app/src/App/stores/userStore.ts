import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../Models/user";
import agent from "../api/agent";
import { RootStore } from './rootStore';
import { history } from "../..";

export default class UserStore {
    
    rootStore: RootStore;
    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        // makeAutoObservable(this);
    }
    @observable user: IUser | null = null;

    @observable loading= false;

    @computed get isLoggedIn() { return !!this.user; }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            // console.log(user);
            history.push('/activities');
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }
    @action register = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            this.rootStore.commonStore.setToken(user.token);
            this.rootStore.modalStore.closeModal();
            history.push('/activities');
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }
    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            });
            this.rootStore.commonStore.setToken(user.token);
        } catch (error) {
            console.log(error);
        }
    };

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    };

    // @action fbLogin = async (response: any) => {
    //     this.loading = true;
    //     try {
    //       const user = await agent.User.fbLogin(response.accessToken);
    //       runInAction(() => {
    //         this.user = user;
    //         this.rootStore.commonStore.setToken(user.token);
    //         this.startRefreshTokenTimer(user);
    //         this.rootStore.modalStore.closeModal();
    //         this.loading = false;
    //       })
    //       history.push('/activities');
    //     } catch (error) {
    //       this.loading = false;
    //       throw error;
    //     }
    //   }
    
    //   private startRefreshTokenTimer(user: IUser) {
    //     const jwtToken = JSON.parse(atob(user.token.split('.')[1]));
    //     const expires = new Date(jwtToken.exp * 1000);
    //     const timeout = expires.getTime() - Date.now() - (60 * 1000);
    //     this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    //   }
    
    //   private stopRefreshTokenTimer() {
    //     clearTimeout(this.refreshTokenTimeout);
    //   }
}