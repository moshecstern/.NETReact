import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
// import BlogStore from "../../../../App/stores/blogStore";
import { RootStoreContext } from "../../../stores/rootStore";
import BlogListItem from "./BlogListItem";
import {format} from 'date-fns';

const BlogList: React.FC = () => {
  // const blogStore = useContext(BlogStore);
  // const { blogsByDate } = blogStore;
  const rootStore = useContext(RootStoreContext);
  const {BlogsByDate} = rootStore.blogStore;

  return (
    <Fragment>
      {BlogsByDate.map(([group, blogs]) => (
        <Fragment key={group}>
          <Label  size="large" color="black">
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {blogs.map((blog) => (
                <BlogListItem key={blog.id} blog={blog} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(BlogList);
