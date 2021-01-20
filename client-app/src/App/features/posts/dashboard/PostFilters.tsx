import React, { Fragment, useContext } from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
// import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const PostFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicatePost, setPredicatePost } = rootStore.postStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicatePost.size === 0}
          onClick={() => setPredicatePost('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All posts'}
        />
        <Menu.Item
          active={predicatePost.has('isLiked')}
          onClick={() => setPredicatePost('isLiked', 'true')}
          color={'blue'}
          name={'username'}
          content={"My Liked Posts"}
        />
        <Menu.Item
          active={predicatePost.has('isHost')}
          onClick={() => setPredicatePost('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"My Posts"}
        />
      </Menu>

      <Header
    icon={'add'}
    attached
    color={'teal'}
    content={'Create'}
  />
      <Button
        as={NavLink}
        to={"/createPost"}
        positive
        content="Create Post"
      />

      {/* <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicatePost('startDate', date!)}
        value={predicatePost.get('startDate') || new Date()}
      /> */}
    </Fragment>
  );
};

export default observer(PostFilters);
