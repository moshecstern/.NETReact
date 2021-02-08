import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import poststore from "../../../../App/stores/poststore";
import { IPost } from "../../../models/post";
import {format} from 'date-fns'
import PostListItemAttendees from './PostListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const PostListItem: React.FC<{ post: IPost }> = ({ post }) => {
  const host = post.liked.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/programs/${post.id}`}>{post.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {post.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this post'
              />
            </Item.Description>
              }
                {post.liked && !post.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You liked this post'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(new Date(post.date), 'H:mm a')}
          {/* <Icon name='marker' /> {post.venue}, {post.city} */}
      </Segment>
      <Segment secondary>
            <PostListItemAttendees
              peopleWhoLiked={post.liked}
            />
      </Segment>
      <Segment clearing>
          <span>{post.description}</span>
          <Button
                as={Link}
                to={`/programs/${post.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default PostListItem;
