export interface IBusinesssEnvelope {
    businesses: IBusiness[];
    businessCount: number;
  }

export interface IBusiness {
    id: string;
    title: string;
    description: string;
    featuredPost: string;
    street: string;
    hours: string;
    city: string;
    image: string;
    state: string;
    website: string;
    isService: boolean;
    category: string;
    date: Date;
    isHost: boolean;
    isLiked: boolean;
    liked: ILikedBusiness[];
    businessComments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IBusinessFormValues extends Partial<IBusiness> {
    time?: Date;
}
export class BusinessFormValues implements IBusinessFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IBusinessFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface ILikedBusiness {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}