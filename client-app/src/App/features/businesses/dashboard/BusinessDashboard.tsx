// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import BusinessList from "./BusinessList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import BusinessListItemPlaceholder from './BusinessListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import BusinessFilters from './BusinessFilters';


const BusinessDashboard: React.FC = () => {
    // MOBX
    // const businessestore = useContext(businessestore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadBusinesses,
      loadingInitialBusiness,
      setPageBusiness,
      pageBusiness,
      totalPagesBusiness
    } = rootStore.businessStore;
    const [loadingNextBusiness, setLoadingNextBusiness] =useState(false);

    const handleGetNext = () => {
      setLoadingNextBusiness(true);
      setPageBusiness(pageBusiness + 1);
      loadBusinesses().then(() => setLoadingNextBusiness(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadBusinesses();
    }, [loadBusinesses]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading businesses..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitialBusiness && pageBusiness === 0 ? (
            <BusinessListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNextBusiness && pageBusiness + 1 < totalPagesBusiness}
            initialLoad={false}
              >
                <BusinessList />
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <BusinessFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNextBusiness} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(BusinessDashboard);
