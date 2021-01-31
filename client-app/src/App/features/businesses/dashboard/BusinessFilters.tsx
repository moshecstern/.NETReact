import React, { Fragment, useContext } from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
// import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const BusinessFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicateBusiness, setPredicateBusiness } = rootStore.businessStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicateBusiness.size === 0}
          onClick={() => setPredicateBusiness('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All businesses'}
        />
        <Menu.Item
          active={predicateBusiness.has('isLiked')}
          onClick={() => setPredicateBusiness('isLiked', 'true')}
          color={'blue'}
          name={'username'}
          content={"My Liked Businesses"}
        />
        <Menu.Item
          active={predicateBusiness.has('isHost')}
          onClick={() => setPredicateBusiness('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"My Businesses"}
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
        to={"/createBusiness"}
        positive
        content="Create Business"
      />
      {/* <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicateBusiness('startDate', date!)}
        value={predicateBusiness.get('startDate') || new Date()}
      /> */}
    </Fragment>
  );
};

export default observer(BusinessFilters);
