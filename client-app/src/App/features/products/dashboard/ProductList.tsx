import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
// import productstore from "../../../../App/stores/productstore";
import { RootStoreContext } from "../../../stores/rootStore";
import ProductListItem from "./ProductListItem";
import {format} from 'date-fns';

const ProductList: React.FC = () => {
  // const productstore = useContext(productstore);
  // const { productsByDate } = productstore;
  const rootStore = useContext(RootStoreContext);
  const {ProductsByDate} = rootStore.productStore;

  return (
    <Fragment>
      {ProductsByDate.map(([group, products]) => (
        <Fragment key={group}>
          <Label  size="large" color="black">
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(ProductList);
