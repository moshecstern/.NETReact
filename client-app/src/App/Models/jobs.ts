
export interface IJobsEnvelope {
    jobs: IJobs[];
    JobsCount: number;
  }

export interface IJobs {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    appliedbool: boolean;
    isHost: boolean;
    Applied: IApplied[];
    comments: IComment[];
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IJobsFormValues extends Partial<IJobs> {
    time?: Date;
}
export class JobsFormValues implements IJobsFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;
    city: string = "";
    venue:string = "";

    constructor(init?: IJobsFormValues) {
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



