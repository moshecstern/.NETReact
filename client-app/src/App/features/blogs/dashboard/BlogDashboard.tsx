// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import BlogList from "./BlogList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import BlogListItemPlaceholder from './BlogListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import BlogFilters from './BlogFilters';


const BlogDashboard: React.FC = () => {
    // MOBX
    // const blogStore = useContext(BlogStore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadBlogs,
      loadingInitial,
      setPage,
      page,
      totalPages
    } = rootStore.blogStore;
    const [loadingNext, setLoadingNext] =useState(false);

    const handleGetNext = () => {
      setLoadingNext(true);
      setPage(page + 1);
      loadBlogs().then(() => setLoadingNext(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadBlogs();
    }, [loadBlogs]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading blogs..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitial && page === 0 ? (
            <BlogListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && page + 1 < totalPages}
            initialLoad={false}
              >
                <BlogList />
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <BlogFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(BlogDashboard);
