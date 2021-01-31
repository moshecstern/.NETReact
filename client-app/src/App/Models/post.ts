export interface IPostsEnvelope {
    posts: IPost[];
    postCount: number;
  }

export interface IPost {
    id: string;
    title: string;
    description: string;
    image: string;
    main2: string;
    main: string;
    category: string;
    date: Date;
    isHost: boolean;
    isLiked: boolean;
    liked: ILikedPost[];
    postComments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IPostFormValues extends Partial<IPost> {
    time?: Date;
}
export class PostFormValues implements IPostFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;
    main?: string = '';
    main2?: string = '';
    image?: string = '';
    link?: string = '';


    constructor(init?: IPostFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface ILikedPost {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}