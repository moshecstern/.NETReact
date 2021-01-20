export interface IProductsEnvelope {
    products: IProduct[];
    productCount: number;
  }

export interface IProduct {
    id: string;
    title: string;
    description: string;
    stock: Number;
    madeBy: string;
    image: string;
    link: string;
    category: string;
    date: Date;
    isHost: boolean;
    isLiked: boolean;
    liked: ILikedProduct[];
    productComments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IProductFormValues extends Partial<IProduct> {
    time?: Date;
}
export class ProductFormValues implements IProductFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;

    constructor(init?: IProductFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface ILikedProduct {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}