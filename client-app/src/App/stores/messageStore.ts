import { observable, action, computed, runInAction, reaction, toJS } from 'mobx';
import { SyntheticEvent } from 'react';
import { IMessage } from '../models/message';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { createMyMessagesMessage, setMessageProps } from '../common/util/util';
import {HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

const LIMIT = 2;


export default class messageStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    reaction(
      () => this.predicateMessage.keys(),
      () => {
        this.pageMessage = 0;
        this.messageRegistry.clear();
        this.loadMessages();
      }
    )
  }

  @observable messageRegistry = new Map();
  @observable message: IMessage | null = null;
  @observable loadingInitialMessage = false;
  @observable submittingMessage = false;
  @observable targetMessage = '';
  @observable loadingMessage = false;
  @observable.ref hubConnectionMessage: HubConnection | null = null;
  @observable messageCount = 0;
  @observable pageMessage = 0;
  @observable predicateMessage = new Map();

  @action setPredicateMessage = (predicate: string, value: string | Date) => {
    this.predicateMessage.clear();
    if (predicate !== 'all') {
      this.predicateMessage.set(predicate, value);
    }
  }

  @computed get axiosParamsMessage() {
    const params = new URLSearchParams();
    params.append('limit', String(LIMIT));
    params.append('offset', `${this.pageMessage ? this.pageMessage * LIMIT : 0}`);
    this.predicateMessage.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params;
  }

  @computed get totalPagesMessage() {
    return Math.ceil(this.messageCount / LIMIT);
  }

  @action setPageMessage = (page: number) => {
    this.pageMessage = page;
  }

  // @action createHubConnectionMessage = (messageId: string) => {
  //   if (!this.hubConnectionMessage) {
  //   this.hubConnectionMessage = new HubConnectionBuilder()
  //     .withUrl(process.env.REACT_APP_API_BLOGCHAT_URL!, {
  //       accessTokenFactory: () => this.rootStore.commonStore.token!
  //     })
  //     .configureLogging(LogLevel.Information)
  //     .build();

  //     this.hubConnectionMessage.on('ReceiveMessageComment', (comment) => runInAction(() => this.message!.comments.push(comment)));
  //     this.hubConnectionMessage.on('SendMessage', (message) => {/*toast.info(message)*/});

  //   }
  //     if (this.hubConnectionMessage!.state === "Disconnected") {
  //   this.hubConnectionMessage
  //     .start()
  //     .then(() => console.log(this.hubConnectionMessage!.state))
  //     .then(() => {
  //       console.log('Attempting to join group');
  //       this.hubConnectionMessage!.invoke('AddToGroupMessage', messageId)
  //     })
  //     .catch(error => console.log('Error establishing connection: ', error));
  //   } else if(this.hubConnectionMessage!.state === 'Connected'){
  //     this.hubConnectionMessage!.invoke('AddToGroup', messageId);
  //   }
  
  //   this.hubConnectionMessage.on('ReceiveMessageComment', comment => {
  //     runInAction(() => {
  //       this.message!.comments.push(comment)
  //     })
  //   })

  //   this.hubConnectionMessage.on('SendMessage', message => {
  //     toast.info(message);
  //   })
  // };

  // @action stopHubConnectionMessage = () => {
  //   if (this.hubConnectionMessage?.state === "Connected") {
  //   this.hubConnectionMessage!.invoke('RemoveFromGroupMessage', this.message!.id)
  //     .then(() => {
  //       this.hubConnectionMessage!.stop()
  //     })
  //     .then(() => console.log('Connection stopped'))
  //     .catch(err => console.log(err))
  // }}

  // @action addCommentMessage = async (values: any) => {
  //   values.messageId = this.message!.id;
  //   try {
  //     await this.hubConnectionMessage!.invoke('SendCommentMessage', values)
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
  @action createHubConnectionMessage = (messageId: string) => {
    this.hubConnectionMessage = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_MESSAGECHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnectionMessage
      .start()
      .then(() => console.log(this.hubConnectionMessage!.state))
      .then(() => {
        console.log('Attempting to join group');
        this.hubConnectionMessage!.invoke('AddToGroupMessage', messageId)
      })
      .catch(error => console.log('Error establishing connection: ', error));
// below 'RecieveComment' is related to API.SignalR.HubCOnnection line40
    this.hubConnectionMessage.on('ReceiveMessageComment', comment => {
      console.log(comment)
      runInAction(() => {
        this.message!.messageComments.push(comment)
      })
    })

    this.hubConnectionMessage.on('SendMessage', message => {
      toast.info(message);
    })
  };

  @action stopHubConnectionMessage = () => {
    this.hubConnectionMessage!.invoke('RemoveFromGroupMessage', this.message!.id)
      .then(() => {
        this.hubConnectionMessage!.stop()
      })
      .then(() => console.log('Connection stopped'))
      .catch(err => console.log(err))
  }

  @action addCommentMessage = async (values: any) => {
    // below values.activityId needs to match whats in Application.create.cs
    values.messageId = this.message!.id;
    try {
      await this.hubConnectionMessage!.invoke('SendCommentMessage', values)
    } catch (error) {
      console.log(error);
    }
  } 


  @computed get MessagesByDate() {
    return this.groupMessagesByDate(
      Array.from(this.messageRegistry.values())
    );
  }

  groupMessagesByDate(Messages: IMessage[]) {
    const sortedMessages = Messages.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedMessages.reduce(
        (Messages, message) => {
          const date = message.date.toISOString().split('T')[0];
          Messages[date] = Messages[date]
            ? [...Messages[date], message]
            : [message];
          return Messages;
        },
        {} as { [key: string]: IMessage[] }
      )
    );
  }

  @action loadMessages = async () => {
    this.loadingInitialMessage = true;
    try {
      const MessagesEnvelope = await agent.Messages.list(this.axiosParamsMessage);
      const {messages, messageCount} = MessagesEnvelope;
      runInAction(() => {
        messages.forEach(message => {
          setMessageProps(message, this.rootStore.userStore.user!);
          this.messageRegistry.set(message.id, message);
        });
        this.messageCount = messageCount;
        this.loadingInitialMessage = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitialMessage = false;
      });
    }
  };

  @action loadmessage = async (id: string) => {
    let message = this.getmessage(id);
    if (message) {
      this.message = message;
      return toJS(message);
    } else {
      this.loadingInitialMessage = true;
      try {
        message = await agent.Messages.details(id);
        runInAction(() => {
          setMessageProps(message, this.rootStore.userStore.user!);
          this.message = message;
          this.messageRegistry.set(message.id, message);
          this.loadingInitialMessage = false;
        });
        return message;
      } catch (error) {
        runInAction(() => {
          this.loadingInitialMessage = false;
        });
        console.log(error);
      }
    }
  };

  @action clearmessage = () => {
    this.message = null;
  };

  getmessage = (id: string) => {
    return this.messageRegistry.get(id);
  };

  @action createmessage = async (message: IMessage) => {
    this.submittingMessage = true;
    try {
      await agent.Messages.create(message);
      const attendee = createMyMessagesMessage(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      message.myMessages = attendees;
      message.isHost = true;
      runInAction(() => {
        this.messageRegistry.set(message.id, message);
        this.submittingMessage = false;
      });
      history.push(`/messages/${message.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingMessage = false;
      });
      toast.error('Problem submitting data');
      console.log(error.response);
    }
  };

  @action editmessage = async (message: IMessage) => {
    this.submittingMessage = true;
    try {
      await agent.Messages.update(message);
      runInAction(() => {
        this.messageRegistry.set(message.id, message);
        this.message = message;
        this.submittingMessage = false;
      });
      history.push(`/messages/${message.id}`);
    } catch (error) {
      runInAction(() => {
        this.submittingMessage = false;
      });
      toast.error('Problem submitting data');
      console.log(error);
    }
  };

  @action deletemessage = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submittingMessage = true;
    this.targetMessage = event.currentTarget.name;
    try {
      await agent.Messages.delete(id);
      runInAction(() => {
        this.messageRegistry.delete(id);
        this.submittingMessage = false;
        this.targetMessage = '';
      });
    } catch (error) {
      runInAction(() => {
        this.submittingMessage = false;
        this.targetMessage = '';
      });
      console.log(error);
    }
  };

  @action myMessagesMessage = async () => {
    const attendee = createMyMessagesMessage(this.rootStore.userStore.user!);
    this.loadingMessage = true;
    try {
      await agent.Messages.sendmessage(this.message!.id);
      runInAction(() => {
        if (this.message) {
          this.message.myMessages.push(attendee);
          this.message.isMessaged = true;
          this.messageRegistry.set(this.message.id, this.message);
          this.loadingMessage = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingMessage = false;
      })
      toast.error('Problem signing up to message');
    }
  };

  @action unsendMessage = async () => {
    this.loadingMessage = true;
    try {
      await agent.Messages.unsendmessage(this.message!.id);
      runInAction(() => {
        if (this.message) {
          this.message.myMessages = this.message.myMessages.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.message.isMessaged = false;
          this.messageRegistry.set(this.message.id, this.message);
          this.loadingMessage = false;
        }
      })
    } catch (error) {
      runInAction(() => {
        this.loadingMessage = false;
      })
      toast.error('Problem cancelling myMessages');
    }
  };
}
