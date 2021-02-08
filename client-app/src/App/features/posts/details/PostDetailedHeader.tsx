import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IPost } from '../../../models/post';
import {format} from 'date-fns';
import { RootStoreContext } from '../../../stores/rootStore';

const PostImageStyle = {
  filter: 'brightness(30%)'
};

const PostImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const PostDetailedHeader: React.FC<{post: IPost}> = ({post}) => {
  const host = post.liked.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const { likePost, unlikePost, loadingPost } = rootStore.postStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${post.category}.jpg`} fluid style={PostImageStyle}/>
            <Segment basic style={PostImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={post.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(new Date(post.date), 'eeee do MMMM')}</p>
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
            {post.isHost ? (
              <Button as={Link} to={`/program/manage/${post.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
              ) : post.isLiked ? (
                <Button loading={loadingPost} onClick={unlikePost}>Cancel attendance</Button>
                ) : (
                <Button loading={loadingPost} onClick={likePost} color='grey'>Join post</Button>
              )}
          </Segment>
        </Segment.Group>
    );
};

export default observer(PostDetailedHeader);
