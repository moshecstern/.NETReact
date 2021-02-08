import React, { Fragment, useContext } from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const ActivityFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicate, setPredicate } = rootStore.activityStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'grey'} content={'Filters'} />
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate('all', 'true')}
          color={'black'}
          name={'all'}
          content={'All Activities'}
        />
        <Menu.Item
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
          color={'black'}
          name={'username'}
          content={"I'm Going"}
        />
        <Menu.Item
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
          color={'black'}
          name={'host'}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={'calendar'}
        attached
        color={'grey'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicate('startDate', date!)}
        value={predicate.get('startDate') || new Date()}
      />
      <br />
            <Header
    icon={'add'}
    attached
    color={'grey'}
    content={'Create'}
  />
      <Button
        as={NavLink}
        to={"/createActivity"}
        positive
        content="Create Activity"
      />
    </Fragment>
  );
};

export default observer(ActivityFilters);
