import React, { Fragment, useContext } from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
// import { Calendar } from 'react-widgets';

import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const BlogFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicateBlog, setPredicateBlog } = rootStore.blogStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
       
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicateBlog.size === 0}
          onClick={() => setPredicateBlog('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All Blogs'}
        />
        <Menu.Item
          active={predicateBlog.has('isLiked')}
          onClick={() => setPredicateBlog('isLiked', 'true')}
          color={'blue'}
          name={'username'}
          content={"I Liked this blog"}
        />
        <Menu.Item
          active={predicateBlog.has('isHost')}
          onClick={() => setPredicateBlog('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"I'm hosting"}
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
        to={"/createBlog"}
        positive
        content="Create Blog"
      />
      {/* <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      /> */}
      {/* <Calendar
        onChange={date => setPredicateBlog('startDate', date!)}
        value={predicateBlog.get('startDate') || new Date()}
      /> */}
    </Fragment>
  );
};

export default observer(BlogFilters);
