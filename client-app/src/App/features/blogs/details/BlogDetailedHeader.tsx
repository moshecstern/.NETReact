import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IBlog } from '../../../models/blog';
import {format} from 'date-fns';
import { RootStoreContext } from '../../../stores/rootStore';

const blogImageStyle = {
  filter: 'brightness(30%)'
};

const blogImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const BlogDetailedHeader: React.FC<{blog: IBlog}> = ({blog}) => {
  const host = blog.liked.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const { likeBlog, unlikeBlog, loadingBlog } = rootStore.blogStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${blog.category}.jpg`} fluid style={blogImageStyle}/>
            <Segment basic style={blogImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={blog.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(blog.date, 'eeee do MMMM')}</p>
                    <p>
                    Hosted by {' '}
                    <Link to={`/profile/${host.username}`}>
                      <strong>{host.displayName}</strong>
                    </Link>
                    </p>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Segment>
          </Segment>
          <Segment clearing attached='bottom'>
            {blog.isHost ? (
              <Button as={Link} to={`/blog/manage/${blog.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
              ) : blog.isLiked ? (
                <Button loading={loadingBlog} onClick={unlikeBlog}>Cancel attendance</Button>
                ) : (
                <Button loading={loadingBlog} onClick={likeBlog} color='grey'>Join Blog</Button>
              )}
          </Segment>
        </Segment.Group>
    );
};

export default observer(BlogDetailedHeader);
