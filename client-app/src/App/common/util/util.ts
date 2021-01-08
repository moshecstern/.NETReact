import { IActivity, IAttendee } from "../../models/activity";
import { IBlog } from "../../models/blog";
import { IJobs } from "../../models/jobs";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
    // const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

    // const year = date.getFullYear();
    // const month = date.getMonth() + 1;
    // const day = date.getDate();
    // const dateString = `${year}-${month}-${day}`;

    const dateString = date.toISOString().split('T')[0];
    const timeString = time.toISOString().split('T')[1];

    return new Date(dateString + 'T' + timeString);
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees.some(
      a => a.username === user.username
    )
    activity.isHost = activity.attendees.some(
      a => a.username === user.username && a.isHost
    )
    return activity;
}

export const setBlogProps = (blog: IBlog, user: IUser) => {
  blog.date = new Date(blog.date);
  blog.isLiked = blog.liked.some(
    a => a.username === user.username
  )
  blog.isHost = blog.liked.some(
    a => a.username === user.username && a.isHost
  )
  return blog;
}

export const setJobProps = (job: IJobs, user: IUser) => {
  job.date = new Date(job.date);
  job.appliedbool = job.Applied.some(
    a => a.username === user.username
  )
  job.isHost = job.Applied.some(
    a => a.username === user.username && a.isHost
  )
  return job;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image!
    }
}