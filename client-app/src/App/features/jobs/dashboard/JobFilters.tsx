import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';

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
          content={"I Applied"}
        />
        <Menu.Item
          active={predicateJob.has('isHost')}
          onClick={() => setpredicateJob('isHost', 'true')}
          color={'blue'}
          name={'host'}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setpredicateJob('startDate', date!)}
        value={predicateJob.get('startDate') || new Date()}
      />
    </Fragment>
  );
};

export default observer(JobFilters);
