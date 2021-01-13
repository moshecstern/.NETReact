// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import JobList from "./JobList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import JobListItemPlaceholder from './JobListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import JobFilters from './JobFilters';


const JobDashboard: React.FC = () => {
    // MOBX
    // const jobStore = useContext(JobStore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadJobs,
      loadingInitialJob,
      setPage,
      page,
      totalPages
    } = rootStore.jobStore;
    const [loadingNext, setLoadingNext] =useState(false);

    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page + 1);
      loadJobs().then(() => setLoadingNext(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadJobs();
    }, [loadJobs]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading jobs..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitialJob && page === 0 ? (
            <JobListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
              >
                <JobList />
                {/* <h1>Hello</h1> */}
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <JobFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(JobDashboard);
