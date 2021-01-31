import React, { useContext, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom';
import { Card, Grid, Header, Tab, Image, TabProps, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../stores/rootStore';
import {IUserExperience} from '../../models/profile';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';

const panes = [
    { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
    { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
    { menuItem: 'Hosting', pane: { key: 'hosted' } }
  ];

const ProfileExperience = () => {
    const rootStore = useContext(RootStoreContext);
    const {
        loadUserExperiences,
        profile,
        loadingExperiences,
        isCurrentUser,
        userExperiences
    } = rootStore.profileStore!;

    useEffect(() => {
        loadUserExperiences(profile!.username);
    }, [loadUserExperiences, profile])

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
        loadUserExperiences(profile!.username, predicate);
      };
    return (
<Tab.Pane loading={loadingExperiences}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Experience'} />
          {isCurrentUser && (
                   <Button
                   as={NavLink}
                   to={"/createExperience"}
                   basic
                   floated='right'
                   content="Create Experience"
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
            {userExperiences.map((experience: IUserExperience) => (
              <Card
                as={Link}
                to={`/experiences/${experience.id}`}
                key={experience.id}
              >
                <Image
                  src={`/assets/categoryImages/${experience.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{experience.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(experience.date), 'do LLL')}</div>
                    <div>{format(new Date(experience.date), 'h:mm a')}</div>
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

export default observer(ProfileExperience);