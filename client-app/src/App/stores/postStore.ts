import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IPost } from '../models/post';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createLikedPost, setPostProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class postStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicatePost.keys(),
      () => {
        this.pagePost = 0;
        this.postRegistry.clear();
        this.loadPosts();
      }
    )
  }

  @observable postRegistry = new Map();
  @observable post: IPost | null = null;
  @observable loadingInitialPost = false;
  @observable submittingPost = false;
  @observable targetPost = '';
  @observable loadingPost = false;
  @observable.ref hubConnectionPost: HubConnection | null = null;
  @observable postCount = 0;
  @observable pagePost = 0;
  @observable predicatePost = new Map();
  @observable currentCategory = '';

  @action setPredicatePost = (predicate: string, value: string | Date) => {
    this.predicatePost.clear();
    if (predicate !== 'all') {
      this.predicatePost.set(predicate, value);
    }
  }

  @computed get axiosParamsPost() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pagePost ? this.pagePost * LIMIT : 0}`);
    this.predicatePost.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPagesPost() {
    return Math.ceil(this.postCount / LIMIT);
  }

  @action setPagePost = (page: number) => {
    this.pagePost = page;
  }

  // @action createHubConnectionPost = (postId: string) => {
  //   if (!this.hubConnectionPost) {
  //   this.hubConnectionPost = new HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
  //       accessTokenFactory: () => this.rootStore.commonStore.token!
  //     })
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //     this.hubConnectionPost.on('ReceivePostComment', (comment) => runInAction(() => this.post!.comments.push(comment)));
  //     this.hubConnectionPost.on('SendPost', (message) => {/*toast.info(message)*/});

  //   }
  //     if (this.hubConnectionPost!.state === "Disconnected") {
  //   this.hubConnectionPost
  //     .start()
  //     .then(() => console.log(this.hubConnectionPost!.state))
  //     .then(() => {
  //       console.log('Attempting to join group');
  //       this.hubConnectionPost!.invoke('AddToGroupPost', postId)
  //     })
  //     .catch(error => console.log('Error establishing connection: ', error));
  //   } else if(this.hubConnectionPost!.state === 'Connected'){
  //     this.hubConnectionPost!.invoke('AddToGroup', postId);
  //   }
  
  //   this.hubConnectionPost.on('ReceivePostComment', comment => {
  //     runInAction(() => {
  //       this.post!.comments.push(comment)
  //     })
  //   })

  //   this.hubConnectionPost.on('SendPost', message => {
  //     toast.info(message);
  //   })
  // };

  // @action stopHubConnectionPost = () => {
  //   if (this.hubConnectionPost?.state === "Connected") {
  //   this.hubConnectionPost!.invoke('RemoveFromGroupPost', this.post!.id)
  //     .then(() => {
  //       this.hubConnectionPost!.stop()
  //     })
  //     .then(() => console.log('Connection stopped'))
  //     .catch(err => console.log(err))
  // }}

  // @action addCommentPost = async (values: any) => {
  //   values.postId = this.post!.id;
  //   try {
  //     await this.hubConnectionPost!.invoke('SendCommentPost', values)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
  @action createHubConnectionPost = (postId: string) => {
    this.hubConnectionPost = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_POSTCHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionPost
      .start()
      .then(() => console.log(this.hubConnectionPost!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionPost!.invoke('AddToGroupPost', postId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
// below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionPost.on('ReceivePostComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.post!.postComments.push(comment)
      })
    })

    this.hubConnectionPost.on('SendPost', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionPost = () => {
    this.hubConnectionPost!.invoke('RemoveFromGroupPost', this.post!.id)
      .then(() => {
        this.hubConnectionPost!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentPost = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.postId = this.post!.id;
    try {
      await this.hubConnectionPost!.invoke('SendCommentPost', values)
    } catch (error) {
      console.log(error);
    }
  } 


  @computed get PostsByDate() {
    return this.groupPostsByDate(
      Array.from(this.postRegistry.values())
    );
  }

  groupPostsByDate(Posts: IPost[]) {
    const sortedPosts = Posts.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedPosts.reduce(
        (Posts, post) => {
          const date = post.date.toISOString().split('T')[0];
          Posts[date] = Posts[date]
            ? [...Posts[date], post]
            : [post];
          return Posts;
        },
        {} as { [key: string]: IPost[] }
      )
    );
  }


  @action loadPosts = async () => {
    this.loadingInitialPost = true;
    try {
      const PostsEnvelope = await agent.Posts.list(this.axiosParamsPost);
      const {posts, postCount} = PostsEnvelope;
      runInAction(() => {
        posts.forEach(post => {
          setPostProps(post, this.rootStore.userStore.user!);
          this.postRegistry.set(post.id, post);
        });
        this.postCount = postCount;
        this.loadingInitialPost = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialPost = false;
      });
    }
  };

  @action loadpost = async (id: string) => {
    let post = this.getpost(id);
    if (post) {
      this.post = post;
      return toJS(post);
    } else {
      this.loadingInitialPost = true;
      try {
        post = await agent.Posts.details(id);
        runInAction(() => {
          setPostProps(post, this.rootStore.userStore.user!);
          this.post = post;
          this.postRegistry.set(post.id, post);
          this.loadingInitialPost = false;
        });
        return post;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialPost = false;
        });
        console.log(error);
      }
    }
  };

  @action clearpost = () => {
    this.post = null;
  };

  getpost = (id: string) => {
    return this.postRegistry.get(id);
  };

  @action createProgram = async (post: IPost) => {
    this.submittingPost = true;
    try {
      await agent.Posts.create(post);
      const attendee = createLikedPost(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      post.liked = attendees;
      post.isHost = true;
      runInAction(() => {
        this.postRegistry.set(post.id, post);
        this.submittingPost = false;
      });
      history.push(`/programs/${post.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingPost = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editpost = async (post: IPost) => {
    this.submittingPost = true;
    try {
      await agent.Posts.update(post);
      runInAction(() => {
        this.postRegistry.set(post.id, post);
        this.post = post;
        this.submittingPost = false;
      });
      history.push(`/programs/${post.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingPost = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deletepost = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingPost = true;
    this.targetPost = event.currentTarget.name;
    try {
      await agent.Posts.delete(id);
      runInAction(() => {
        this.postRegistry.delete(id);
        this.submittingPost = false;
        this.targetPost = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingPost = false;
        this.targetPost = '';
      });
      console.log(error);
    }
  };

  @action likePost = async () => {
    const attendee = createLikedPost(this.rootStore.userStore.user!);
    this.loadingPost = true;
    try {
      await agent.Posts.like(this.post!.id);
      runInAction(() => {
        if (this.post) {
          this.post.liked.push(attendee);
          this.post.isLiked = true;
          this.postRegistry.set(this.post.id, this.post);
          this.loadingPost = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingPost = false;
      })
      toast.error('Problem signing up to post');
    }
  };

  @action unlikePost = async () => {
    this.loadingPost = true;
    try {
      await agent.Posts.unlike(this.post!.id);
      runInAction(() => {
        if (this.post) {
          this.post.liked = this.post.liked.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.post.isLiked = false;
          this.postRegistry.set(this.post.id, this.post);
          this.loadingPost = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingPost = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
