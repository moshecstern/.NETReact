import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import BlogDetailedHeader from "./BlogDetailedHeader";
import BlogDetailedInfo from "./BlogDetailedInfo";
import BlogDetailedChat from "./BlogDetailedChat";
import BlogDetailedSidebar from "./BlogDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const BlogDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadblog, loadingInitialBlog, blog} = rootStore.blogStore;
  const [ initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    loadblog(match.params.id).then(()=>setInitialLoad(false));
  }, [loadblog, match.params.id, history]);

  if (loadingInitialBlog || !blog || initialLoad)
    return <LoadingComponent content="Loading blog..." />;

  if (!blog)
  return <h2>Blog not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <BlogDetailedHeader blog={blog} />
      <BlogDetailedInfo blog={blog} />
      {!initialLoad && <BlogDetailedChat />}
   </Grid.Column>
   <Grid.Column width={6}>
      <BlogDetailedSidebar
        attendees={blog.liked}
      />
   </Grid.Column>
 </Grid>
  );
};

export default observer(BlogDetails);
