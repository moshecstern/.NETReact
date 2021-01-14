import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IBlog } from '../models/blog';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createLikedBlog, setBlogProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class blogStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicateBlog.keys(),
      () => {
        this.pageBlog = 0;
        this.blogRegistry.clear();
        this.loadBlogs();
      }
    )
  }

  @observable blogRegistry = new Map();
  @observable blog: IBlog | null = null;
  @observable loadingInitialBlog = false;
  @observable submittingBlog = false;
  @observable targetBlog = '';
  @observable loadingBlog = false;
  @observable.ref hubConnectionBlog: HubConnection | null = null;
  @observable blogCount = 0;
  @observable pageBlog = 0;
  @observable predicateBlog = new Map();

  @action setPredicateBlog = (predicate: string, value: string | Date) => {
    this.predicateBlog.clear();
    if (predicate !== 'all') {
      this.predicateBlog.set(predicate, value);
    }
  }

  @computed get axiosParamsBlog() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pageBlog ? this.pageBlog * LIMIT : 0}`);
    this.predicateBlog.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPagesBlog() {
    return Math.ceil(this.blogCount / LIMIT);
  }

  @action setPageBlog = (page: number) => {
    this.pageBlog = page;
  }

  // @action createHubConnectionBlog = (blogId: string) => {
  //   if (!this.hubConnectionBlog) {
  //   this.hubConnectionBlog = new HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
  //       accessTokenFactory: () => this.rootStore.commonStore.token!
  //     })
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //     this.hubConnectionBlog.on('ReceiveBlogComment', (comment) => runInAction(() => this.blog!.comments.push(comment)));
  //     this.hubConnectionBlog.on('SendBlog', (message) => {/*toast.info(message)*/});

  //   }
  //     if (this.hubConnectionBlog!.state === "Disconnected") {
  //   this.hubConnectionBlog
  //     .start()
  //     .then(() => console.log(this.hubConnectionBlog!.state))
  //     .then(() => {
  //       console.log('Attempting to join group');
  //       this.hubConnectionBlog!.invoke('AddToGroupBlog', blogId)
  //     })
  //     .catch(error => console.log('Error establishing connection: ', error));
  //   } else if(this.hubConnectionBlog!.state === 'Connected'){
  //     this.hubConnectionBlog!.invoke('AddToGroup', blogId);
  //   }
  
  //   this.hubConnectionBlog.on('ReceiveBlogComment', comment => {
  //     runInAction(() => {
  //       this.blog!.comments.push(comment)
  //     })
  //   })

  //   this.hubConnectionBlog.on('SendBlog', message => {
  //     toast.info(message);
  //   })
  // };

  // @action stopHubConnectionBlog = () => {
  //   if (this.hubConnectionBlog?.state === "Connected") {
  //   this.hubConnectionBlog!.invoke('RemoveFromGroupBlog', this.blog!.id)
  //     .then(() => {
  //       this.hubConnectionBlog!.stop()
  //     })
  //     .then(() => console.log('Connection stopped'))
  //     .catch(err => console.log(err))
  // }}

  // @action addCommentBlog = async (values: any) => {
  //   values.blogId = this.blog!.id;
  //   try {
  //     await this.hubConnectionBlog!.invoke('SendCommentBlog', values)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
  @action createHubConnectionBlog = (blogId: string) => {
    this.hubConnectionBlog = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionBlog
      .start()
      .then(() => console.log(this.hubConnectionBlog!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionBlog!.invoke('AddToGroupBlog', blogId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
// below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionBlog.on('ReceiveBlogComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.blog!.blogComments.push(comment)
      })
    })

    this.hubConnectionBlog.on('SendBlog', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionBlog = () => {
    this.hubConnectionBlog!.invoke('RemoveFromGroupBlog', this.blog!.id)
      .then(() => {
        this.hubConnectionBlog!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentBlog = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.blogId = this.blog!.id;
    try {
      await this.hubConnectionBlog!.invoke('SendCommentBlog', values)
    } catch (error) {
      console.log(error);
    }
  } 


  @computed get BlogsByDate() {
    return this.groupBlogsByDate(
      Array.from(this.blogRegistry.values())
    );
  }

  groupBlogsByDate(Blogs: IBlog[]) {
    const sortedBlogs = Blogs.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedBlogs.reduce(
        (Blogs, blog) => {
          const date = blog.date.toISOString().split('T')[0];
          Blogs[date] = Blogs[date]
            ? [...Blogs[date], blog]
            : [blog];
          return Blogs;
        },
        {} as { [key: string]: IBlog[] }
      )
    );
  }

  @action loadBlogs = async () => {
    this.loadingInitialBlog = true;
    try {
      const BlogsEnvelope = await agent.Blogs.list(this.axiosParamsBlog);
      const {blogs, blogCount} = BlogsEnvelope;
      runInAction(() => {
        blogs.forEach(blog => {
          setBlogProps(blog, this.rootStore.userStore.user!);
          this.blogRegistry.set(blog.id, blog);
        });
        this.blogCount = blogCount;
        this.loadingInitialBlog = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialBlog = false;
      });
    }
  };

  @action loadblog = async (id: string) => {
    let blog = this.getblog(id);
    if (blog) {
      this.blog = blog;
      return toJS(blog);
    } else {
      this.loadingInitialBlog = true;
      try {
        blog = await agent.Blogs.details(id);
        runInAction(() => {
          setBlogProps(blog, this.rootStore.userStore.user!);
          this.blog = blog;
          this.blogRegistry.set(blog.id, blog);
          this.loadingInitialBlog = false;
        });
        return blog;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialBlog = false;
        });
        console.log(error);
      }
    }
  };

  @action clearblog = () => {
    this.blog = null;
  };

  getblog = (id: string) => {
    return this.blogRegistry.get(id);
  };

  @action createblog = async (blog: IBlog) => {
    this.submittingBlog = true;
    try {
      await agent.Blogs.create(blog);
      const attendee = createLikedBlog(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      blog.liked = attendees;
      blog.isHost = true;
      runInAction(() => {
        this.blogRegistry.set(blog.id, blog);
        this.submittingBlog = false;
      });
      history.push(`/blogs/${blog.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingBlog = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editblog = async (blog: IBlog) => {
    this.submittingBlog = true;
    try {
      await agent.Blogs.update(blog);
      runInAction(() => {
        this.blogRegistry.set(blog.id, blog);
        this.blog = blog;
        this.submittingBlog = false;
      });
      history.push(`/blogs/${blog.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingBlog = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteblog = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingBlog = true;
    this.targetBlog = event.currentTarget.name;
    try {
      await agent.Blogs.delete(id);
      runInAction(() => {
        this.blogRegistry.delete(id);
        this.submittingBlog = false;
        this.targetBlog = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingBlog = false;
        this.targetBlog = '';
      });
      console.log(error);
    }
  };

  @action likeBlog = async () => {
    const attendee = createLikedBlog(this.rootStore.userStore.user!);
    this.loadingBlog = true;
    try {
      await agent.Blogs.like(this.blog!.id);
      runInAction(() => {
        if (this.blog) {
          this.blog.liked.push(attendee);
          this.blog.isLiked = true;
          this.blogRegistry.set(this.blog.id, this.blog);
          this.loadingBlog = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingBlog = false;
      })
      toast.error('Problem signing up to blog');
    }
  };

  @action unlikeBlog = async () => {
    this.loadingBlog = true;
    try {
      await agent.Blogs.unlike(this.blog!.id);
      runInAction(() => {
        if (this.blog) {
          this.blog.liked = this.blog.liked.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.blog.isLiked = false;
          this.blogRegistry.set(this.blog.id, this.blog);
          this.loadingBlog = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingBlog = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
