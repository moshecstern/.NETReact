import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import PostDetailedHeader from "./PostDetailedHeader";
import PostDetailedInfo from "./PostDetailedInfo";
import PostDetailedChat from "./PostDetailedChat";
import PostDetailedSidebar from "./PostDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const PostDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadpost, loadingInitialPost, post} = rootStore.postStore;
  const [ initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    loadpost(match.params.id).then(()=>setInitialLoad(false));
  }, [loadpost, match.params.id, history]);

  if (loadingInitialPost || !post || initialLoad)
    return <LoadingComponent content="Loading post..." />;

  if (!post)
  return <h2>post not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <PostDetailedHeader post={post} />
      <PostDetailedInfo post={post} />
      {!initialLoad && <PostDetailedChat />}
   </Grid.Column>
   <Grid.Column width={6}>
      <PostDetailedSidebar
        attendees={post.liked}
      />
   </Grid.Column>
 </Grid>
  );
};

export default observer(PostDetails);
