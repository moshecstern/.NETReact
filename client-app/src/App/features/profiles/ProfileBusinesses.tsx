import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Header, Card, Image, TabProps, Button } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { IUserBusiness } from '../../models/profile';
import { format } from 'date-fns';
import { RootStoreContext } from '../../stores/rootStore';


const panes = [
  { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
  { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
  { menuItem: 'Hosting', pane: { key: 'hosted' } }
];

const ProfileBusinesses = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadUserBusinesses,
    profile,
    loadingBusinesses,
    isCurrentUser,
    userBusinesses
  } = rootStore.profileStore!;

  useEffect(() => {
    loadUserBusinesses(profile!.username);
  }, [loadUserBusinesses, profile]);

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
    loadUserBusinesses(profile!.username, predicate);
  };

  return (
    <Tab.Pane loading={loadingBusinesses}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Businesses'} />
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
            {userBusinesses.map((business: IUserBusiness) => (
              <Card
                as={Link}
                to={`/businesses/${business.id}`}
                key={business.id}
              >
                <Image
                  src={`/assets/categoryImages/${business.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{business.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(business.date), 'do LLL')}</div>
                    <div>{format(new Date(business.date), 'h:mm a')}</div>
                  </Card.Meta>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileBusinesses);