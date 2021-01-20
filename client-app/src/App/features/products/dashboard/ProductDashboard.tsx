// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ProductList from "./ProductList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import ProductListItemPlaceholder from './ProductListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ProductFilters from './ProductFilters';


const ProductDashboard: React.FC = () => {
    // MOBX
    // const productstore = useContext(productstore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadProducts,
      loadingInitialProduct,
      setPageProduct,
      pageProduct,
      totalPagesProduct
    } = rootStore.productStore;
    const [loadingNextproduct, setLoadingNextproduct] =useState(false);

    const handleGetNext = () => {
      setLoadingNextproduct(true);
      setPageProduct(pageProduct + 1);
      loadProducts().then(() => setLoadingNextproduct(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadProducts();
    }, [loadProducts]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading products..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitialProduct && pageProduct === 0 ? (
            <ProductListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNextproduct && pageProduct + 1 < totalPagesProduct}
            initialLoad={false}
              >
                <ProductList />
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <ProductFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNextproduct} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(ProductDashboard);
