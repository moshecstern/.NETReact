import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IJob } from '../../../models/jobs';
import {format} from 'date-fns';
import { RootStoreContext } from '../../../stores/rootStore';

const jobImageStyle = {
  filter: 'brightness(30%)'
};

const jobImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const JobDetailedHeader: React.FC<{job: IJob}> = ({job}) => {
  const host = job.applied.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const { applyjob, unlikeJob, loadingJob } = rootStore.jobStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${job.category}.jpg`} fluid style={jobImageStyle}/>
            <Segment basic style={jobImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={job.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(job.date, 'eeee do MMMM')}</p>
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
            {job.isHost ? (
              <Button as={Link} to={`/job/manage/${job.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
              ) : job.isApplied ? (
                <Button loading={loadingJob} onClick={unlikeJob}>Cancel application</Button>
                ) : (
                <Button loading={loadingJob} onClick={applyjob} color='grey'>Apply</Button>
              )}
          </Segment>
        </Segment.Group>
    );
};

export default observer(JobDetailedHeader);
