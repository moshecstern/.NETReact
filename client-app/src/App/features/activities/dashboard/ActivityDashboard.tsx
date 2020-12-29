// start typing rafc
import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../../App/stores/activityStore";
import LoadingComponent from "../../../Layout/LoadingComponent";

const ActivityDashboard: React.FC = () => {
    // MOBX
    const activityStore = useContext(ActivityStore);

    // LIFECYCLE
    useEffect(() => {
      activityStore.loadActivities();
    }, [activityStore]);
  
    if (activityStore.loadingInitial)
      return <LoadingComponent content="Loading activities..." />;
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity filters</h2>
        </Grid.Column>
      </Grid>
    </div>
  );
};
export default observer(ActivityDashboard);
