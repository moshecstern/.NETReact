import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import JobStore from "../../../../App/stores/jobStore";
import { IJob } from "../../../models/jobs";
import {format} from 'date-fns'
import JobListItemAttendees from './JobListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const JobListItem: React.FC<{ job: IJob }> = ({ job }) => {
  const host = job.applied.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/jobs/${job.id}`}>{job.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {job.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this job'
              />
            </Item.Description>
              }
                {job.applied && !job.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are going to this job'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(job.date, 'H:mm a')}
          <Icon name='marker' /> , {job.city}
      </Segment>
      <Segment secondary>
            <JobListItemAttendees
              applicants={job.applied}
            />
      </Segment>
      <Segment clearing>
          <span>{job.description}</span>
          <Button
                as={Link}
                to={`/jobs/${job.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default JobListItem;
