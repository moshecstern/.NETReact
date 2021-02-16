export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}

export interface IMessageUserFormValues {
    title: string;
    message: string;
    email: string;
}