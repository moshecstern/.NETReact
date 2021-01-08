import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IBlog } from '../models/blog';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createAttendee, setBlogProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class blogStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.blogRegistry.clear();
        this.loadBlogs();
      }
    )
  }

  @observable blogRegistry = new Map();
  @observable blog: IBlog | null = null;
  @observable loadingInitial = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;
  @observable.ref hubConnection: HubConnection | null = null;
  @observable blogCount = 0;
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
    return Math.ceil(this.blogCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  }

  @action createHubConnection = (blogId: string) => {
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
        this.hubConnection!.invoke('AddToGroup', blogId)
      })
      .catch(error => console.log('Error establishing connection: ', error));

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.blog!.comments.push(comment)
      })
    })

    this.hubConnection.on('Send', message => {
      toast.info(message);
    })
  };

  @action stopHubConnection = () => {
    this.hubConnection!.invoke('RemoveFromGroup', this.blog!.id)
      .then(() => {
        this.hubConnection!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addComment = async (values: any) => {
    values.blogId = this.blog!.id;
    try {
      await this.hubConnection!.invoke('SendComment', values)
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
    this.loadingInitial = true;
    try {
      const BlogsEnvelope = await agent.Blogs.list(this.axiosParams);
      const {blogs, blogCount} = BlogsEnvelope;
      runInAction('loading Blogs', () => {
        blogs.forEach(blog => {
          setBlogProps(blog, this.rootStore.userStore.user!);
          this.blogRegistry.set(blog.id, blog);
        });
        this.blogCount = blogCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load Blogs error', () => {
        this.loadingInitial = false;
      });
    }
  };

  @action loadblog = async (id: string) => {
    let blog = this.getblog(id);
    if (blog) {
      this.blog = blog;
      return toJS(blog);
    } else {
      this.loadingInitial = true;
      try {
        blog = await agent.Blogs.details(id);
        runInAction('getting blog', () => {
          setBlogProps(blog, this.rootStore.userStore.user!);
          this.blog = blog;
          this.blogRegistry.set(blog.id, blog);
          this.loadingInitial = false;
        });
        return blog;
      } catch (error) {
        runInAction('get blog error', () => {
          this.loadingInitial = false;
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
    this.submitting = true;
    try {
      await agent.Blogs.create(blog);
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      blog.liked = attendees;
      blog.isHost = true;
      runInAction('create blog', () => {
        this.blogRegistry.set(blog.id, blog);
        this.submitting = false;
      });
      history.push(`/Blogs/${blog.id}`);
    } catch (error) {
      runInAction('create blog error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editblog = async (blog: IBlog) => {
    this.submitting = true;
    try {
      await agent.Blogs.update(blog);
      runInAction('editing blog', () => {
        this.blogRegistry.set(blog.id, blog);
        this.blog = blog;
        this.submitting = false;
      });
      history.push(`/Blogs/${blog.id}`);
    } catch (error) {
      runInAction('edit blog error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deleteblog = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Blogs.delete(id);
      runInAction('deleting blog', () => {
        this.blogRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('delete blog error', () => {
        this.submitting = false;
        this.target = '';
      });
      console.log(error);
    }
  };

  @action likeBlog = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Blogs.like(this.blog!.id);
      runInAction(() => {
        if (this.blog) {
          this.blog.liked.push(attendee);
          this.blog.isLiked = true;
          this.blogRegistry.set(this.blog.id, this.blog);
          this.loading = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      })
      toast.error('Problem signing up to blog');
    }
  };

  @action unlikeBlog = async () => {
    this.loading = true;
    try {
      await agent.Blogs.unlike(this.blog!.id);
      runInAction(() => {
        if (this.blog) {
          this.blog.liked = this.blog.liked.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.blog.isLiked = false;
          this.blogRegistry.set(this.blog.id, this.blog);
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
