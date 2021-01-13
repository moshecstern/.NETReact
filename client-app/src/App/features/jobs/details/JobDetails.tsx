import React, { useContext, useEffect } from "react";
import { Grid} from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../../Layout/LoadingComponent";
import JobDetailedHeader from "./JobDetailedHeader";
import JobDetailedInfo from "./JobDetailedInfo";
import JobDetailedChat from "./JobDetailedChat";
import JobDetailedSidebar from "./JobDetailedSidebar";
import { RootStoreContext } from "../../../stores/rootStore";

interface DetailParams {
  id: string;
}

const JobDetails: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const rootStore = useContext(RootStoreContext);
  const {loadJob, loadingInitialJob, job} = rootStore.jobStore;

  useEffect(() => {
    loadJob(match.params.id);
  }, [loadJob, match.params.id, history]);

  if (loadingInitialJob || !job)
    return <LoadingComponent content="Loading job..." />;

  if (!job)
  return <h2>Job not found</h2>

  return (
 <Grid>
   <Grid.Column width={10}>
      <JobDetailedHeader job={job} />
      <JobDetailedInfo job={job} />
      <JobDetailedChat />
   </Grid.Column>
   <Grid.Column width={6}>
      <JobDetailedSidebar
        applicants={job.applied}
      />
   </Grid.Column>
 </Grid>
  );
};

export default observer(JobDetails);
