import React, { Fragment, useContext } from 'react';
import { Menu, Header } from 'semantic-ui-react';
// import { Calendar } from 'react-widgets';
import { RootStoreContext } from '../../../stores/rootStore';
import { observer } from 'mobx-react-lite';
// import { NavLink } from 'react-router-dom';

const ProductFilters = () => {
  const rootStore = useContext(RootStoreContext);
  const { predicateProduct, setPredicateProduct } = rootStore.productStore;
  return (
    <Fragment>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'grey'} content={'Filters'} />
        <Menu.Item
          active={predicateProduct.size === 0}
          onClick={() => setPredicateProduct('all', 'true')}
          color={'black'}
          name={'all'}
          content={'All products'}
        />
        <Menu.Item
          active={predicateProduct.has('isLiked')}
          onClick={() => setPredicateProduct('isLiked', 'true')}
          color={'black'}
          name={'username'}
          content={"I Liked this product"}
        />
        <Menu.Item
          active={predicateProduct.has('isHost')}
          onClick={() => setPredicateProduct('isHost', 'true')}
          color={'black'}
          name={'host'}
          content={"I'm hosting"}
        />
      </Menu>

      {/* edit make user roles and if this user roles == admin then show */}
      {/* <Header
    icon={'add'}
    attached
    color={'grey'}
    content={'Create'}
  />
      <Button
        as={NavLink}
        to={"/createProduct"}
        positive
        content="Create Product"
      /> */}




      {/* <Header
        icon={'calendar'}
        attached
        color={'grey'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicateProduct('startDate', date!)}
        value={predicateProduct.get('startDate') || new Date()}
      /> */}
    </Fragment>
  );
};

export default observer(ProductFilters);
