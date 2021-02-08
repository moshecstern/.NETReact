import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IExperience } from '../../../models/experience';
import {format} from 'date-fns';
// import { RootStoreContext } from '../../../stores/rootStore';

const ExperienceImageStyle = {
  filter: 'brightness(30%)'
};

const ExperienceImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ExperienceDetailedHeader: React.FC<{Experience: IExperience}> = ({Experience}) => {
  const host = Experience.liked.filter(x => x.isHost)[0];
  // const rootStore = useContext(RootStoreContext);
  // const { loadExperiences } = rootStore.experienceStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${Experience.category}.jpg`} fluid style={ExperienceImageStyle}/>
            <Segment basic style={ExperienceImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={Experience.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(new Date(Experience.date), 'eeee do MMMM')}</p>
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
            {/* {Experience.isHost ? ( */}
            {Experience.isHost && 
              <Button as={Link} to={`/experience/manage/${Experience.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
}
            {/* //   ) : Experience.isLiked ? ( */}
                {/* // <Button loading={loadingExperience} onClick={unlikeExperience}>Cancel attendance</Button> */}
                {/* // ) : ( */}
                {/* // <Button loading={loadingExperience} onClick={likeExperience} color='grey'>Join Experience</Button> */}
            {/* //   )} */}
          </Segment>
        </Segment.Group>
    );
};

export default observer(ExperienceDetailedHeader);
