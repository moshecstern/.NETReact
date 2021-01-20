// start typing rafc
import React, { useContext, useEffect, useState } from "react";
import { Grid, Loader } from "semantic-ui-react";
import PostList from "./PostList";
import { observer } from "mobx-react-lite";
// import LoadingComponent from "../../../Layout/LoadingComponent";
import PostListItemPlaceholder from './PostListItemPlaceholder';
import { RootStoreContext } from "../../../stores/rootStore";
import InfiniteScroll from "react-infinite-scroller";
import PostFilters from './PostFilters';


const PostDashboard: React.FC = () => {
    // MOBX
    // const poststore = useContext(poststore);
    const rootStore = useContext(RootStoreContext);
    const {
      loadPosts,
      loadingInitialPost,
      setPagePost,
      pagePost,
      totalPagesPost
    } = rootStore.postStore;
    const [loadingNextpost, setLoadingNextpost] =useState(false);

    const handleGetNext = () => {
      setLoadingNextpost(true);
      setPagePost(pagePost + 1);
      loadPosts().then(() => setLoadingNextpost(false));
    };

    // LIFECYCLE
    useEffect(() => {
     loadPosts();
    }, [loadPosts]);
  
    // if (loadingInitial)
    //   return <LoadingComponent content="Loading posts..." />;
  return (
      <Grid>
        <Grid.Column width={10}>
          {loadingInitialPost && pagePost === 0 ? (
            <PostListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNextpost && pagePost + 1 < totalPagesPost}
            initialLoad={false}
              >
                <PostList />
              </InfiniteScroll>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <PostFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNextpost} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(PostDashboard);
