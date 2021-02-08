import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import BlogStore from "../../../../App/stores/blogStore";
import { IBlog } from "../../../models/blog";
import {format} from 'date-fns'
import BlogListItemAttendees from './BlogListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const BlogListItem: React.FC<{ blog: IBlog }> = ({ blog }) => {
  const host = blog.liked.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/blogs/${blog.id}`}>{blog.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {blog.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this blog'
              />
            </Item.Description>
              }
                {blog.liked && !blog.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You liked this blog'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(new Date(blog.date), 'H:mm a')}
          {/* <Icon name='marker' /> {blog.venue}, {blog.city} */}
      </Segment>
      <Segment secondary>
            <BlogListItemAttendees
              peopleWhoLiked={blog.liked}
            />
      </Segment>
      <Segment clearing>
          <span>{blog.description}</span>
          <Button
                as={Link}
                to={`/blogs/${blog.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default BlogListItem;
