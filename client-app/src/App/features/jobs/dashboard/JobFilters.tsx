import React, { Fragment, useContext } from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';

const JobFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicateJob, setpredicateJob } = rootStore.jobStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicateJob.size === 0}
          onClick={() => setpredicateJob('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All Jobs'}
        />
        <Menu.Item
          active={predicateJob.has('isApplied')}
          onClick={() => setpredicateJob('isApplied', 'true')}
          color={'blue'}
          name={'username'}
          content={"Applied Jobs"}
        />
        <Menu.Item
          active={predicateJob.has('isHost')}
          onClick={() => setpredicateJob('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"My Posted Jobs"}
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
        to={"/createJob"}
        positive
        content="Create Job"
      />
      {/* <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setpredicateJob('startDate', date!)}
        value={predicateJob.get('startDate') || new Date()}
      /> */}
    </Fragment>
  );
};

export default observer(JobFilters);
