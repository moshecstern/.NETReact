import { IActivity, IAttendee } from "../../models/activity";
import { IBlog, ILikedBlog } from "../../models/blog";
import { IExperience } from "../../models/experience";
import { IJob, IApplied } from "../../models/jobs";
import {IBusiness, ILikedBusiness } from "../../models/business";
import { ILikedPost, IPost } from "../../models/post";
import { IMessage, IMyMessagesMessage } from "../../models/message";
import { ILikedProduct, IProduct } from "../../models/product";
// import { IExperience } from "../../models/profile";
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
export const onlyDate = (date: Date) => {
  return new Date(date)
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
export const setJobProps = (job: IJob, user: IUser) => {
  job.date = new Date(job.date);
  job.isApplied = job.applied.some(
    a => a.username === user.username
  )
  job.isHost = job.applied.some(
    a => a.username === user.username && a.isHost
  )
  return job;
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

export const setExperienceProps = (experience: IExperience, user: IUser) => {
  experience.date = new Date(experience.date);
  experience.isLiked = experience.liked.some(
    a => a.username === user.username
  )
  experience.isHost = experience.liked.some(
    a => a.username === user.username && a.isHost
  )
  return experience;
}

export const setBusinessProps = (business: IBusiness, user: IUser) => {
  business.date = new Date(business.date);
  business.isLiked = business.liked.some(
    a => a.username === user.username
  )
  business.isHost = business.liked.some(
    a => a.username === user.username && a.isHost
  )
  return business;
}
export const createLikedBusiness = (user: IUser): ILikedBusiness => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        displayName: user.displayName,
        isHost: false,
        username: user.username,
        image: user.image!
    }
}
export const createLikedBlog = (user: IUser): ILikedBlog => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }
}
export const createApplicant = (user: IUser): IApplied => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }

}
// edit to posts
export const setPostProps = (post: IPost, user: IUser) => {
  post.date = new Date(post.date);
  post.isLiked = post.liked.some(
    a => a.username === user.username
  )
  post.isHost = post.liked.some(
    a => a.username === user.username && a.isHost
  )
  return post;
}
export const createLikedPost = (user: IUser): ILikedPost => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }
}


// edit to products
export const setProductProps = (product: IProduct, user: IUser) => {
  product.date = new Date(product.date);
  product.isLiked = product.liked.some(
    a => a.username === user.username
  )
  product.isHost = product.liked.some(
    a => a.username === user.username && a.isHost
  )
  return product;
}
export const createLikedProduct = (user: IUser): ILikedProduct => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }
}


// edit to messages
export const setMessageProps = (message: IMessage, user: IUser) => {
  message.date = new Date(message.date);
  message.isMessaged = message.myMessages.some(
    a => a.username === user.username
  )
  message.isHost = message.myMessages.some(
    a => a.username === user.username && a.isHost
  )
  return message;
}
export const createMyMessagesMessage = (user: IUser): IMyMessagesMessage => {
  return {
      displayName: user.displayName,
      isHost: false,
      username: user.username,
      image: user.image!
  }
}