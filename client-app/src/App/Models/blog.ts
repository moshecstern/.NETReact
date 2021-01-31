
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
    isLiked: boolean;
    liked: ILikedBlog[];
    blogComments: IComment[];
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
    main: string = '';
    main2: string = '';
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IBlogFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface ILikedBlog {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}