import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Tab, Grid, Header, Card, Image, TabProps, Button } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import { IUserBlog } from '../../models/profile';
import { format } from 'date-fns';
import { RootStoreContext } from '../../stores/rootStore';


const panes = [
  { menuItem: 'Future Events', pane: { key: 'futureEvents' } },
  { menuItem: 'Past Events', pane: { key: 'pastEvents' } },
  { menuItem: 'Hosting', pane: { key: 'hosted' } }
];

const ProfileBlogs = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadUserBlogs,
    profile,
    loadingBlogs,
    isCurrentUser,
    userBlogs
  } = rootStore.profileStore!;

  useEffect(() => {
    loadUserBlogs(profile!.username);
  }, [loadUserBlogs, profile]);

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
    loadUserBlogs(profile!.username, predicate);
  };

  return (
    <Tab.Pane loading={loadingBlogs}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='calendar' content={'Blogs'} />
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
            {userBlogs.map((blog: IUserBlog) => (
              <Card
                as={Link}
                to={`/blogs/${blog.id}`}
                key={blog.id}
              >
                <Image
                  src={`/assets/categoryImages/${blog.category}.jpg`}
                  style={{ minHeight: 100, objectFit: 'cover' }}
                />
                <Card.Content>
                  <Card.Header textAlign='center'>{blog.title}</Card.Header>
                  <Card.Meta textAlign='center'>
                    <div>{format(new Date(blog.date), 'do LLL')}</div>
                    <div>{format(new Date(blog.date), 'h:mm a')}</div>
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

export default observer(ProfileBlogs);