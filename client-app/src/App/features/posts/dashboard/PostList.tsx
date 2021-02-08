import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
// import poststore from "../../../../App/stores/poststore";
import { RootStoreContext } from "../../../stores/rootStore";
import PostListItem from "./PostListItem";
import {format} from 'date-fns';

const PostList: React.FC = () => {
  // const poststore = useContext(poststore);
  // const { postsByDate } = poststore;
  const rootStore = useContext(RootStoreContext);
  const {PostsByDate} = rootStore.postStore;

  return (
    <Fragment>
      {PostsByDate.map(([group, posts]) => (
        <Fragment key={group}>
          <Label  size="large" color="black">
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {posts.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(PostList);
