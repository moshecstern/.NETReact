import axios, { AxiosResponse } from 'axios';
// import { config } from 'process';
// import { runInAction } from 'mobx';
import { toast } from 'react-toastify';
import { history } from '../..';
import { IActivity } from '../Models/activity';
import { IUser, IUserFormValues } from '../Models/user';

axios.defaults.baseURL = 'http://localhost:5000/api';

// Middleware
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, error => {
    return Promise.reject(error);
})


axios.interceptors.response.use(undefined, error => {
    if (error.message === 'Network Error' && !error.response) {
        toast.error('Network Error - API may be down')
    }
    const {status, data, config} = error.response;
    if (error.response.status === 404) {
        history.push('/notfound');
    }
    // console.log(error.response);
    if (status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id')) {
        history.push('/notfound')
    }
    if (status === 500) {
        toast.error('Server error - please check terminal for more info')
    }
    throw error.response;
});

// End Middleware
const responseBody = (response: AxiosResponse) => response.data;

// const sleep = (ms: number) => (response: AxiosResponse) => 
//     new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const Activities = {
    list: (): Promise<IActivity[]> => requests.get('/activities'),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post('/activities', activity),
    update: (activity: IActivity) => requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`),
}

const User = {
    current: (): Promise<IUser> => requests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
    refreshToken: (): Promise<IUser> => requests.post(`/user/refreshToken`, {}),
}

const agent = {
    Activities,
    User
}
export default agent