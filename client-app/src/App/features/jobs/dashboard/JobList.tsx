import { observer } from "mobx-react-lite";
import React, { Fragment, useContext } from "react";
import { Item, Label } from "semantic-ui-react";
// import JobStore from "../../../../App/stores/jobStore";
import { RootStoreContext } from "../../../stores/rootStore";
import JobListItem from "./JobListItem";
import {format} from 'date-fns';

const JobList: React.FC = () => {
  // const jobStore = useContext(JobStore);
  // const { jobsByDate } = jobStore;
  const rootStore = useContext(RootStoreContext);
  const {jobsByDate} = rootStore.jobStore;

  return (
    <Fragment>
      {jobsByDate.map(([group, jobs]) => (
        <Fragment key={group}>
          <Label  size="large" color="black">
            {format(new Date(group), 'eeee do MMMM')}
          </Label>
            <Item.Group divided>
              {jobs.map((job) => (
                <JobListItem key={job.id} job={job} />
              ))}
            </Item.Group>
        </Fragment>
      ))}
    </Fragment>
  );
};

export default observer(JobList);
