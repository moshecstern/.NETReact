
export interface IJobsEnvelope {
    jobs: IJob[];
    jobCount: number;
  }


export interface IJob {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    isApplied: boolean;
    isHost: boolean;
    applied: IApplied[];
    jobComments: IJobComment[];
}

export interface IJobComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IJobFormValues extends Partial<IJob> {
    time?: Date;
}
export class JobFormValues implements IJobFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = "";
    // venue:string = "";

    constructor(init?: IJobFormValues) {
        if (init && init.date){
            init.time = init.date
        }
        Object.assign(this, init);
    } 
}

export interface IApplied {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}

// export interface IEmployee {
//     username: string;
//     displayName: string;
//     image: string;
//     isHost: boolean;
//     following?: boolean;
// }

