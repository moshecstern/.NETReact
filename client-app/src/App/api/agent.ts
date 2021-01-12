import axios, { AxiosResponse } from 'axios';
import { IActivity, IActivitiesEnvelope } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';
import { IJobs, IJobsEnvelope } from '../models/jobs';
import { IBlog, IBlogsEnvelope } from '../models/blog';
import { IExperience, IExperiencesEnvelope } from '../models/experience';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  config => {
    const token = window.localStorage.getItem('jwt');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, error => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - make sure API is running!');
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) {
    history.push('/notfound');
  }
  if (status === 401 && headers['www-authenticate'] === 'Bearer error="invalid_token", error_description="The token is expired"') {
    window.localStorage.removeItem('jwt');
    history.push('/')
    toast.info('Your session has expired, please login again')
  }
  if (
    status === 400 &&
    config.method === 'get' &&
    data.errors.hasOwnProperty('id')
  ) {
    history.push('/notfound');
  }
  if (status === 500) {
    toast.error('Server error - check the terminal for more info!');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) =>
    axios
      .get(url)
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body)
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body)
      .then(responseBody),
  del: (url: string) =>
    axios
      .delete(url)
      .then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append('File', file);
    return axios
      .post(url, formData, {
        headers: { 'Content-type': 'multipart/form-data' }
      })
      .then(responseBody);
  }
};


const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios.get('/activities', { params: params }).then(responseBody),
  details: (id: string) => requests.get(`/activities/${id}`),
  create: (activity: IActivity) => requests.post('/activities', activity),
  update: (activity: IActivity) =>
    requests.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.del(`/activities/${id}`),
  attend: (id: string) => requests.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => requests.del(`/activities/${id}/attend`)
};

const User = {
  current: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/login`, user),
  register: (user: IUserFormValues): Promise<IUser> =>
    requests.post(`/user/register`, user),
  fbLogin: (accessToken: string) =>
    requests.post(`/user/facebook`, { accessToken }),
  refreshToken: (): Promise<IUser> => requests.post(`/user/refreshToken`, {}),
  verifyEmail: (token: string, email: string): Promise<void> =>
    requests.post(`/user/verifyEmail`, { token, email }),
  resendVerifyEmailConfirm: (email: string): Promise<void> =>
    requests.get(`/user/resendEmailVerification?email=${email}`)
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    requests.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    requests.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => requests.del(`/photos/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    requests.put(`/profiles`, profile),
  follow: (username: string) =>
    requests.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) => requests.del(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/activities?predicate=${predicate}`),
    listJobs: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/jobs?predicate=${predicate}`),
    listExperiences: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/experiences?predicate=${predicate}`),
    listBlogs: (username: string, predicate: string) =>
    requests.get(`/profiles/${username}/blogs?predicate=${predicate}`)
  
  // post message/id 
  
  };

  const Jobs = {
    list: (params: URLSearchParams): Promise<IJobsEnvelope> =>
      axios.get('/jobs', { params: params }).then(responseBody),
    details: (id: string) => requests.get(`/jobs/${id}`),
    create: (job: IJobs) => requests.post('/jobs', job),
    update: (job: IJobs) =>
      requests.put(`/jobs/${job.id}`, job),
    delete: (id: string) => requests.del(`/jobs/${id}`),
    apply: (id: string) => requests.post(`/jobs/${id}/apply`, {}),
    unapply: (id: string) => requests.del(`/jobs/${id}/unapply`)
  };

  const Blogs = {
    list: (params: URLSearchParams): Promise<IBlogsEnvelope> =>
      axios.get('/blogs', { params: params }).then(responseBody),
    details: (id: string) => requests.get(`/blogs/${id}`),
    create: (activity: IBlog) => requests.post('/blogs', activity),
    update: (activity: IBlog) =>
      requests.put(`/blogs/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/blogs/${id}`),
    like: (id: string) => requests.post(`/blogs/${id}/like`, {}),
    unlike: (id: string) => requests.del(`/blogs/${id}/unlike`)
  };

  const Experiences = {
    list: (params: URLSearchParams): Promise<IExperiencesEnvelope> =>
      axios.get('/experiences', { params: params }).then(responseBody),
    details: (id: string) => requests.get(`/experiences/${id}`),
    create: (experience: IExperience) => requests.post('/experiences', experience),
    update: (experience: IExperience) =>
      requests.put(`/experiences/${experience.id}`, experience),
    delete: (id: string) => requests.del(`/experiences/${id}`),
    like: (id: string) => requests.post(`/experiences/${id}/like`, {}),
    unlike: (id: string) => requests.del(`/experiences/${id}/unlike`)
  };

export default  {
  Activities,
  User,
  Profiles,
  Jobs,
  Blogs,
  Experiences
};
