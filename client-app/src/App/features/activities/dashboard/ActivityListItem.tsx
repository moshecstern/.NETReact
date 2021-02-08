import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import ActivityStore from "../../../../App/stores/activityStore";
import { IActivity } from "../../../models/activity";
import {format} from 'date-fns'
import ActivityListItemAttendees from './ActivityListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  const host = activity.attendees.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {activity.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this activity'
              />
            </Item.Description>
              }
                {activity.isGoing && !activity.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are going to this activity'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(activity.date, 'H:mm a')}
          <Icon name='marker' /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
            <ActivityListItemAttendees
              attendees={activity.attendees}
            />
      </Segment>
      <Segment clearing>
          <span>{activity.description}</span>
          <Button
                as={Link}
                to={`/activities/${activity.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
