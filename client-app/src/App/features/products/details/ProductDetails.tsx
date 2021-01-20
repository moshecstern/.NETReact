import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import ProductDetailedHeader from "./ProductDetailedHeader";
import ProductDetailedInfo from "./ProductDetailedInfo";
import ProductDetailedChat from "./ProductDetailedChat";
import ProductDetailedSidebar from "./ProductDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const ProductDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadproduct, loadingInitialProduct, product} = rootStore.productStore;
  const [ initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    loadproduct(match.params.id).then(()=>setInitialLoad(false));
  }, [loadproduct, match.params.id, history]);

  if (loadingInitialProduct || !product || initialLoad)
    return <LoadingComponent content="Loading product..." />;

  if (!product)
  return <h2>product not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <ProductDetailedHeader product={product} />
      <ProductDetailedInfo product={product} />
      {!initialLoad && <ProductDetailedChat />}
   </Grid.Column>
   <Grid.Column width={6}>
      <ProductDetailedSidebar
        attendees={product.liked}
      />
   </Grid.Column>
 </Grid>
  );
};

export default observer(ProductDetails);
