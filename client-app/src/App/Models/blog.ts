
export interface IBlogsEnvelope {
    blogs: IBlog[];
    blogCount: number;
  }

export interface IBlog {
    id: string;
    title: string;
    description: string;
    main: string;
    main2: string;
    category: string;
    date: Date;
    isHost: boolean;
    liked: IAttendee[];
    comments: IComment[];
    isLiked: boolean;
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IBlogFormValues extends Partial<IBlog> {
    time?: Date;
}
export class BlogFormValues implements IBlogFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IBlogFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}