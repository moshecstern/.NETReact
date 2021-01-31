import React, { useContext, useEffect, useState } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import ExperienceDetailedHeader from "./ExperienceDetailedHeader";
import ExperienceDetailedInfo from "./ExperienceDetailedInfo";
// import ExperienceDetailedChat from "./ExperienceDetailedChat";
// import ExperienceDetailedSidebar from "./ExperienceDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const ExperienceDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadExperience, loadingInitialExperience, experience} = rootStore.experienceStore;
  const [ initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    loadExperience(match.params.id).then(()=>setInitialLoad(false));
  }, [loadExperience, match.params.id, history]);

  if (loadingInitialExperience || !experience || initialLoad)
    return <LoadingComponent content="Loading Experience..." />;

  if (!experience)
  return <h2>Experience not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <ExperienceDetailedHeader Experience={experience} />
      <ExperienceDetailedInfo Experience={experience} />
      {/* {!initialLoad && <ExperienceDetailedChat />} */}
   </Grid.Column>
   {/* <Grid.Column width={6}>
      <ExperienceDetailedSidebar
        attendees={experience.liked}
      />
   </Grid.Column> */}
 </Grid>
  );
};

export default observer(ExperienceDetails);
