export interface IProfile {
    displayName: string;
    username: string;
    bio: string;
    LongBio: string;
    image: string;
    following: boolean;
    followersCount: number;
    followingCount: number;
    photos: IPhoto[];
    messages: IMessages[];
    // experiences: IExperience[];
    isBusiness: boolean;
    // blogs: IBlogs[];
    // jobs: IJobs[];
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

  export interface IUserJob {
    id: string;
    title: string;
    category: string;
    date: Date;
  }

  export interface IUserBlog {
    id: string;
    title: string;
    category: string;
    date: Date;
  }
  export interface IUserBusiness {
    id: string;
    title: string;
    category: string;
    date: Date;
  }

  export interface IUserExperience {
    id: string;
    title: string;
    category: string;
    date: Date;
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