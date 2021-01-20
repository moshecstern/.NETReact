export interface IMessagesEnvelope {
    messages: IMessage[];
    messageCount: number;
  }

export interface IMessage {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    isHost: boolean;
    isMessaged: boolean;
    myMessages: IMyMessagesMessage[];
    messageComments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IMessageFormValues extends Partial<IMessage> {
    time?: Date;
}
export class MessageFormValues implements IMessageFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IMessageFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface IMyMessagesMessage {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}