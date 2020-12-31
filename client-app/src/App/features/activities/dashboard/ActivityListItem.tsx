import React from "react";
import { Button, Icon, Item, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import ActivityStore from "../../../../App/stores/activityStore";
import { IActivity } from "../../../Models/activity";
import {format} from 'date-fns'

const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
  //   const activityStore = useContext(ActivityStore);
  //   const {} = activityStore;
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src="/assets/user.png" />
          <Item.Content>
            <Item.Header as="a">{activity.title}</Item.Header>
            <Item.Description>
            Hosted By Moshe
            </Item.Description>
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(activity.date, 'H:mm a')}
          <Icon name='marker' /> {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
            Attendees will go here
      </Segment>
      <Segment clearing>
          <span>{activity.description}</span>
          <Button
                as={Link}
                to={`/activities/${activity.id}`}
                floated="right"
                content="View"
                color="blue"
              />
      </Segment>
    </Segment.Group>
  );
};

export default ActivityListItem;
