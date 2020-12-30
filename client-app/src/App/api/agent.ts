import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { IActivity } from '../Models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

// Middleware
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
})

// End Middleware
const responseBody = (response: AxiosResponse) => response.data;

// const sleep = (ms: number) => (response: AxiosResponse) => 
//     new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms))

const request = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),
};

const Activities = {
    list: (): Promise<IActivity[]> => request.get('/activities'),
    details: (id: string) => request.get(`/activities/${id}`),
    create: (activity: IActivity) => request.post('/activities', activity),
    update: (activity: IActivity) => request.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => request.del(`/activities/${id}`),
}
const agent = {
    Activities
}
export default agent