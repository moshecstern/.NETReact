import React, { useContext, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { Card, Grid, Header, Tab, Image, TabProps, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import {IUserJob} from '../../models/profile';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

const panes = [
    { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
    { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
    { menuItem: 'Hosting', pane: { key: 'hosted' } }
  ];

const ProfileJobs = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadUserJobs,
        profile,
        loadingJobs,
        isCurrentUser,
        userJobs
    } = rootStore.profileStore!;

    useEffect(() => {
        loadUserJobs(profile!.username);
    }, [loadUserJobs, profile])

    const handleTabChange = (
        e: React.MouseEvent<HTMLDivElement, MouseEvent>,
        data: TabProps
      ) => {
        let predicate;
        switch (data.activeIndex) {
          case 1:
            predicate = 'past';
            break;
          case 2:
            predicate = 'hosting';
            break;
          default:
            predicate = 'future';
            break;
        }
        loadUserJobs(profile!.username, predicate);
      };
    return (
<Tab.Pane loading={loadingJobs}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Jobs'} />
          {isCurrentUser && (
                   <Button
                   as={NavLink}
                   to={"/createJob"}
                   basic
                   floated='right'
                   content="Create Job"
                 />
       )}
        
        </Grid.Column>
        <Grid.Column width={16}>
          <Tab
            panes={panes}
            menu={{ secondary: true, pointing: true }}
            onTabChange={(e, data) => handleTabChange(e, data)}
          />
          <br />
          <Card.Group itemsPerRow={4}>
            {userJobs.map((job: IUserJob) => (
              <Card
                as={Link}
                to={`/activities/${job.id}`}
                key={job.id}
              >
                <Image
                  src={`/assets/categoryImages/${job.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{job.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(job.date), 'do LLL')}</div>
                    <div>{format(new Date(job.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
    )
}

export default observer(ProfileJobs)