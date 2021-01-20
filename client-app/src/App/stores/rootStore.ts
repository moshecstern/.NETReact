import { createContext } from "react";
import ActivityStore from "./activityStore";
import UserStore from "./userStore";
import { configure } from "mobx";
import CommonStore from './commonStore';
import ModalStore from './modalStore';
import ProfileStore from './profileStore';
import JobStore from './jobStore';
import BlogStore from './blogStore';
import ExperienceStore from './experienceStore';
import BusinessStore from './businessStore';
import PostStore from './postStore';
import MessageStore from './messageStore';
import ProductStore from './productStore';

configure({ enforceActions: "always" });

export class RootStore {
    activityStore: ActivityStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    jobStore: JobStore;
    blogStore: BlogStore;
    experienceStore: ExperienceStore;
    businessStore: BusinessStore;
    postStore: PostStore;
    messageStore: MessageStore;
    productStore: ProductStore;

    constructor() {
        this.activityStore = new ActivityStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.profileStore = new ProfileStore(this);
        this.jobStore = new JobStore(this);
        this.blogStore = new BlogStore(this);
        this.experienceStore = new ExperienceStore(this);
        this.businessStore = new BusinessStore(this);
        this.postStore = new PostStore(this);
        this.productStore = new ProductStore(this);
        this.messageStore = new MessageStore(this);
    }
}
export const RootStoreContext = createContext(new RootStore());
