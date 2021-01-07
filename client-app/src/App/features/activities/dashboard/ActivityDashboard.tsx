// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import ActivityFilters from './ActivityFilters';


const ActivityDashboard: React.FC = () => {
    // MOBX
    // const activityStore = useContext(ActivityStore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadActivities,
      loadingInitial,
      setPage,
      page,
      totalPages
    } = rootStore.activityStore;
    const [loadingNext, setLoadingNext] =useState(false);

    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page + 1);
      loadActivities().then(() => setLoadingNext(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadActivities();
    }, [loadActivities]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading activities..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitial && page === 0 ? (
            <ActivityListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
              >
                <ActivityList />
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivityFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(ActivityDashboard);
