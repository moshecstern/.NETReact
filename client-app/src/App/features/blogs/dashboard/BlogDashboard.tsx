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
      loadingInitialBlog,
      setPageBlog,
      pageBlog,
      totalPagesBlog
    } = rootStore.blogStore;
    const [loadingNextBlog, setLoadingNextBlog] =useState(false);

    const handleGetNext = () => {
      setLoadingNextBlog(true);
      setPageBlog(pageBlog + 1);
      loadBlogs().then(() => setLoadingNextBlog(false));
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
          {loadingInitialBlog && pageBlog === 0 ? (
            <BlogListItemPlaceholder />
          ) : (
            <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNextBlog && pageBlog + 1 < totalPagesBlog}
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
          <Loader active={loadingNextBlog} />
        </Grid.Column>
      </Grid>
  );
};
export default observer(BlogDashboard);
