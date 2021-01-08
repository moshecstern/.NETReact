export interface IProfile {
    displayName: string;
    username: string;
    bio: string;
    image: string;
    following: boolean;
    followersCount: number;
    followingCount: number;
    photos: IPhoto[];
    messages: IMessages[];
    experience: IExperience[];
  }
  // add above messages, postedJobs, appliedJobs, experience, blogs

  export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
  }
  
  export interface IUserActivity {
    id: string;
    title: string;
    category: string;
    date: Date;
  }

  export interface IExperience {
    id: string;
    catagory: string;
    dateStarted: Date;
    dateEnded: Date;
    title: string;
    main: string;
    main2: string;
    image: string;
    photo: IPhoto[];
    skills: ISkills[];
    link1: string;
    link1Name: string;
    link2: string;
    link2Name: string;
  }

  export interface IMessages {
    id: string;
    title: string;
    main: string;
    main2: string;
    date: Date;
  }

  export interface ISkills {
    skill: string;
  }