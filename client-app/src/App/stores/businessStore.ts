import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IBusiness } from '../models/business';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createLikedBusiness, setBusinessProps } from '../common/util/util';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const LIMIT = 2;


export default class businessStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicateBusiness.keys(),
      () => {
        this.pageBusiness = 0;
        this.businessRegistry.clear();
        this.loadBusinesses();
      }
    )
  }

  @observable businessRegistry = new Map();
  @observable business: IBusiness | null = null;
  @observable loadingInitialBusiness = false;
  @observable submittingBusiness = false;
  @observable targetBusiness = '';
  @observable loadingBusiness = false;
  @observable.ref hubConnectionBusiness: HubConnection | null = null;
  @observable businessCount = 0;
  @observable pageBusiness = 0;
  @observable predicateBusiness = new Map();

  @action setPredicateBusiness = (predicate: string, value: string | Date) => {
    this.predicateBusiness.clear();
    if (predicate !== 'all') {
      this.predicateBusiness.set(predicate, value);
    }
  }

  @computed get axiosParamsBusiness() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pageBusiness ? this.pageBusiness * LIMIT : 0}`);
    this.predicateBusiness.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPagesBusiness() {
    return Math.ceil(this.businessCount / LIMIT);
  }

  @action setPageBusiness = (page: number) => {
    this.pageBusiness = page;
  }

  // @action createHubConnectionBusiness = (businessId: string) => {
  //   if (!this.hubConnectionBusiness) {
  //   this.hubConnectionBusiness = new HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
  //       accessTokenFactory: () => this.rootStore.commonStore.token!
  //     })
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //     this.hubConnectionBusiness.on('ReceiveBusinessComment', (comment) => runInAction(() => this.business!.comments.push(comment)));
  //     this.hubConnectionBusiness.on('SendBusiness', (message) => {/*toast.info(message)*/});

  //   }
  //     if (this.hubConnectionBusiness!.state === "Disconnected") {
  //   this.hubConnectionBusiness
  //     .start()
  //     .then(() => console.log(this.hubConnectionBusiness!.state))
  //     .then(() => {
  //       console.log('Attempting to join group');
  //       this.hubConnectionBusiness!.invoke('AddToGroupBusiness', businessId)
  //     })
  //     .catch(error => console.log('Error establishing connection: ', error));
  //   } else if(this.hubConnectionBusiness!.state === 'Connected'){
  //     this.hubConnectionBusiness!.invoke('AddToGroup', businessId);
  //   }

  //   this.hubConnectionBusiness.on('ReceiveBusinessComment', comment => {
  //     runInAction(() => {
  //       this.business!.comments.push(comment)
  //     })
  //   })

  //   this.hubConnectionBusiness.on('SendBusiness', message => {
  //     toast.info(message);
  //   })
  // };

  // @action stopHubConnectionBusiness = () => {
  //   if (this.hubConnectionBusiness?.state === "Connected") {
  //   this.hubConnectionBusiness!.invoke('RemoveFromGroupBusiness', this.business!.id)
  //     .then(() => {
  //       this.hubConnectionBusiness!.stop()
  //     })
  //     .then(() => console.log('Connection stopped'))
  //     .catch(err => console.log(err))
  // }}

  // @action addCommentBusiness = async (values: any) => {
  //   values.businessId = this.business!.id;
  //   try {
  //     await this.hubConnectionBusiness!.invoke('SendCommentBusiness', values)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
  @action createHubConnectionBusiness = (businessId: string) => {
    this.hubConnectionBusiness = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_BUSINESSCHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionBusiness
      .start()
      .then(() => console.log(this.hubConnectionBusiness!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionBusiness!.invoke('AddToGroupBusiness', businessId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
    // below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionBusiness.on('ReceiveBusinessComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.business!.businessComments.push(comment)
      })
    })

    this.hubConnectionBusiness.on('SendBusiness', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionBusiness = () => {
    this.hubConnectionBusiness!.invoke('RemoveFromGroupBusiness', this.business!.id)
      .then(() => {
        this.hubConnectionBusiness!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentBusiness = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.businessId = this.business!.id;
    try {
      await this.hubConnectionBusiness!.invoke('SendCommentBusiness', values)
    } catch (error) {
      console.log(error);
    }
  }


  @computed get BusinessesByDate() {
    return this.groupBusinessesByDate(
      Array.from(this.businessRegistry.values())
    );
  }
  groupBusinessesByName(businesses: IBusiness[]){

  }
  groupBusinessesByDate(businesses: IBusiness[]) {
    const sortedBusinesses = businesses.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
      // (a, b) => a.date.getDate() - b.date.getDate()
    );
    return Object.entries(
      sortedBusinesses.reduce(
        (businesses, business) => {
          // const date = business.date.toISOString().split('T')[0] || business.date.toUTCString();
          // const date = business.date;
          const date = business.date.toISOString().split('T')[0];
          businesses[date] = businesses[date]
            ? [...businesses[date], business]
            : [business];
          return businesses;
        },
        {} as { [key: string]: IBusiness[] }
      )
    );
  }

  @action loadBusinesses = async () => {
    this.loadingInitialBusiness = true;
    try {
      const BusinessesEnvelope = await agent.Businesses.list(this.axiosParamsBusiness);
      const { businesses, businessCount } = BusinessesEnvelope;
      runInAction(() => {
        businesses.forEach(business => {
          setBusinessProps(business, this.rootStore.userStore.user!);
          this.businessRegistry.set(business.id, business);
        });
        this.businessCount = businessCount;
        this.loadingInitialBusiness = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialBusiness = false;
      });
    }
  };

  @action loadbusiness = async (id: string) => {
    let business = this.getbusiness(id);
    if (business) {
      this.business = business;
      return toJS(business);
    } else {
      this.loadingInitialBusiness = true;
      try {
        business = await agent.Businesses.details(id);
        runInAction(() => {
          setBusinessProps(business, this.rootStore.userStore.user!);
          this.business = business;
          this.businessRegistry.set(business.id, business);
          this.loadingInitialBusiness = false;
        });
        return business;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialBusiness = false;
        });
        console.log(error);
      }
    }
  };

  @action clearbusiness = () => {
    this.business = null;
  };

  getbusiness = (id: string) => {
    return this.businessRegistry.get(id);
  };

  @action createbusiness = async (business: IBusiness) => {
    this.submittingBusiness = true;
    try {
      await agent.Businesses.create(business);
      const attendee = createLikedBusiness(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      business.liked = attendees;
      business.isHost = true;
      runInAction(() => {
        this.businessRegistry.set(business.id, business);
        this.submittingBusiness = false;
      });
      history.push(`/businesses/${business.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingBusiness = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editbusiness = async (business: IBusiness) => {
    this.submittingBusiness = true;
    try {
      await agent.Businesses.update(business);
      runInAction(() => {
        this.businessRegistry.set(business.id, business);
        this.business = business;
        this.submittingBusiness = false;
      });
      history.push(`/businesses/${business.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingBusiness = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deletebusiness = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingBusiness = true;
    this.targetBusiness = event.currentTarget.name;
    try {
      await agent.Businesses.delete(id);
      runInAction(() => {
        this.businessRegistry.delete(id);
        this.submittingBusiness = false;
        this.targetBusiness = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingBusiness = false;
        this.targetBusiness = '';
      });
      console.log(error);
    }
  };

  @action likeBusiness = async () => {
    const attendee = createLikedBusiness(this.rootStore.userStore.user!);
    this.loadingBusiness = true;
    try {
      await agent.Businesses.like(this.business!.id);
      runInAction(() => {
        if (this.business) {
          this.business.liked.push(attendee);
          this.business.isLiked = true;
          this.businessRegistry.set(this.business.id, this.business);
          this.loadingBusiness = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingBusiness = false;
      })
      toast.error('Problem signing up to business');
    }
  };

  @action unlikeBusiness = async () => {
    this.loadingBusiness = true;
    try {
      await agent.Businesses.unlike(this.business!.id);
      runInAction(() => {
        if (this.business) {
          this.business.liked = this.business.liked.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.business.isLiked = false;
          this.businessRegistry.set(this.business.id, this.business);
          this.loadingBusiness = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingBusiness = false;
      })
      toast.error('Problem cancelling like');
    }
  };
}
