import { RootStore } from './rootStore';
import { observable, action, runInAction, computed, reaction } from 'mobx';
import { IProfile, IPhoto, IUserActivity, IUserExperience, IUserJob, IUserBlog, IUserBusiness } from '../models/profile';

import agent from '../api/agent';
import { toast } from 'react-toastify';

export default class ProfileStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
        () => this.activeTab,
        activeTab => {
            if (activeTab === 3 || activeTab === 4) {
                const predicate = activeTab === 3 ? 'followers' : 'following';
                this.loadFollowings(predicate)
            } else {
                this.followings = [];
            }
        }
    )
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  @observable loadingActivities = false;

  @observable userJobs: IUserJob[] = [];
  @observable loadingJobs = false;
  @observable userBlogs: IUserBlog[] = [];
  @observable loadingBlogs = false;
  @observable userExperiences: IUserExperience[] = [];
  @observable loadingExperiences = false;
  @observable userBusinesses: IUserBusiness[] = [];
  @observable loadingBusinesses = false;

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loadingActivities = true;
    try {
      const activities = await agent.Profiles.listActivities(username, predicate!);
      runInAction(() => {
        this.userActivities = activities;
        this.loadingActivities = false;
      })
    } catch (error) {
      toast.error('Problem loading activities')
      runInAction(() => {
        this.loadingActivities = false;
      })
    }
  }

  @action setActiveTab = (activeIndex: number) => {
      this.activeTab = activeIndex;
  } 

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
      console.log(error);
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error('Problem uploading photo');
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url;
        this.profile!.photos.find(a => a.isMain)!.isMain = false;
        this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
        this.profile!.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem setting photo as main');
      runInAction(() => {
        this.loading = false;
      });
    }
  };



  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          a => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem deleting the photo');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action updateProfile = async (profile: Partial<IProfile>) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
        }
        this.profile = { ...this.profile!, ...profile };
      });
    } catch (error) {
      toast.error('Problem updating profile');
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.profile!.following = true;
        this.profile!.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem following user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.profile!.following = false;
        this.profile!.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error('Problem unfollowing user');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
          this.followings = profiles;
          this.loading = false;
      })
    } catch (error) {
      toast.error('Problem loading followings');
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  // new content here

  
  @action loadUserBlogs = async (username: string, predicate?: string) => {
    this.loadingBlogs = true;
    try {
      const blogs = await agent.Profiles.listBlogs(username, predicate!);
      runInAction(() => {
        this.userBlogs = blogs;
        this.loadingBlogs = false;
      })
    } catch (error) {
      toast.error('Problem loading blogs')
      runInAction(() => {
        this.loadingBlogs = false;
      })
    }
  }

  @action loadUserJobs = async (username: string, predicate?: string) => {
    this.loadingJobs = true;
    try {
      const jobs = await agent.Profiles.listJobs(username, predicate!);
      runInAction(() => {
        this.userJobs = jobs;
        this.loadingJobs = false;
      })
    } catch (error) {
      toast.error('Problem loading jobs')
      runInAction(() => {
        this.loadingJobs = false;
      })
    }
  }

  @action loadUserExperiences = async (username: string, predicate?: string) => {
    this.loadingExperiences = true;
    try {
      const experiences = await agent.Profiles.listExperiences(username, predicate!);
      runInAction(() => {
        this.userExperiences = experiences;
        this.loadingExperiences = false;
      })
    } catch (error) {
      toast.error('Problem loading Experiences')
      runInAction(() => {
        this.loadingExperiences = false;
      })
    }
  }

  @action loadUserBusinesses = async (username: string, predicate?: string) => {
    this.loadingBusinesses = true;
    try {
      const business = await agent.Profiles.listBusinesses(username, predicate!);
      runInAction(() => {
        this.userBusinesses = business;
        this.loadingBusinesses = false;
      })
    } catch (error) {
      toast.error('Problem loading Business')
      runInAction(() => {
        this.loadingBusinesses = false;
      })
    }
  }

//   @action setBusinessPhoto = async (photo: IPhoto) => {
//     this.loading = true;
//     try {
//       await agent.Profiles.setMainPhoto(photo.id);
//       runInAction(() => {
//         this.rootStore.userStore.user!.image = photo.url;
//         this.profile!.photos.find(a => a.isMain)!.isMain = false;
//         this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
//         this.profile!.image = photo.url;
//         this.loading = false;
//       });
//     } catch (error) {
//       toast.error('Problem setting photo as main');
//       runInAction(() => {
//         this.loading = false;
//       });
//     }
//   };
}
