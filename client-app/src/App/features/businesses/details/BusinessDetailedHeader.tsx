import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IBusiness } from '../../../models/business';
import {format} from 'date-fns';
import { RootStoreContext } from '../../../stores/rootStore';

const BusinessImageStyle = {
  filter: 'brightness(30%)'
};

const BusinessImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const BusinessDetailedHeader: React.FC<{Business: IBusiness}> = ({Business}) => {
  const host = Business.liked.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const { likeBusiness, unlikeBusiness, loadingBusiness } = rootStore.businessStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${Business.category}.jpg`} fluid style={BusinessImageStyle}/>
            <Segment basic style={BusinessImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={Business.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(Business.date, 'eeee do MMMM')}</p>
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
            {Business.isHost ? (
              <Button as={Link} to={`/Business/manage/${Business.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
              ) : Business.isLiked ? (
                <Button loading={loadingBusiness} onClick={unlikeBusiness}>Cancel attendance</Button>
                ) : (
                <Button loading={loadingBusiness} onClick={likeBusiness} color='grey'>Join Business</Button>
              )}
          </Segment>
        </Segment.Group>
    );
};

export default observer(BusinessDetailedHeader);
