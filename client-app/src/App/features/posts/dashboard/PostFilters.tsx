import React, { Fragment, useContext} from 'react';
import { Menu, Header, Button } from 'semantic-ui-react';
// import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import {categoryPrograms} from '../../../common/options/categoryOptions';
// import ProgramCard from '../details/ProgramCard';

const PostFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicatePost, setPredicatePost } = rootStore.postStore;
  // const [myCategory, setMyCategory] = useState('');
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'grey'} content={'Filters'} />
        <Menu.Item
          active={predicatePost.size === 0}
          onClick={() => setPredicatePost('all', 'true')}
          color={'black'}
          name={'all'}
          content={'All posts'}
        />
        <Menu.Item
          active={predicatePost.has('isLiked')}
          onClick={() => setPredicatePost('isLiked', 'true')}
          color={'black'}
          name={'username'}
          content={"My Liked Posts"}
        />
        <Menu.Item
          active={predicatePost.has('isHost')}
          onClick={() => setPredicatePost('isHost', 'true')}
          color={'black'}
          name={'host'}
          content={"My Posts"}
        />
      </Menu>

{/* add categoryPrograms in card here as filter */}

<Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'grey'} content={'Programs'} />
        {categoryPrograms.map((cat => (

          <Menu.Item
          key={cat.key}
          active={predicatePost.has('myCat')}
          onClick={() => setPredicatePost('myCat', cat.value)}          color={'black'}
          name={cat.text}
          content={cat.text}
          // add donate link
          />
          )))}
        </Menu>

<Header
icon={'add'}
attached
color={'grey'}
content={'Create'}
/>
      <Button
        as={NavLink}
        to={"/createProgram"}
        positive
        content="Create Post"
      />

      {/* <Header
        icon={'calendar'}
        attached
        color={'grey'}
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
