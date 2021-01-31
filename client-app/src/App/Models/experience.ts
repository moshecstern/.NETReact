
export interface IExperiencesEnvelope {
    experiences: IExperience[];
    experienceCount: number;
  }

export interface IExperience {
    id: string;
    title: string;
    main: string;
    main2: string;
    category: string;
    date: Date;
    dateStarted: Date;
    dateEnded: Date;
    isHost: boolean;
    isLiked: boolean;
    liked: IAttendee[];
    comments: IComment[];
    link1: string;
    link1Name: string;
    link2: string;
    link2Name: string;
    skills: string;
    image: string;
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
  }

export interface IExperienceFormValues extends Partial<IExperience> {
    time?: Date;
}
export class experienceFormValues implements IExperienceFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = "";
    description: string = "";
    date?: Date = undefined;
    time?: Date = undefined;
    city?: string = '';
    image?: string = '';
    main2?: string = '';
    main?: string = '';
    link1?: string = '';
    link1Name?: string = '';
    link2?: string = '';
    link2Name?: string = '';
    skills?: string = '';
    dateEnded?: Date = undefined;
    dateStarted?: Date = undefined;

    constructor(init?: IExperienceFormValues) {
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