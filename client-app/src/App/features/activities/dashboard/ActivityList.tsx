import React from 'react'
import { Button, Image, Item, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../Models/activity'

interface IProps {
    activities: IActivity[];
    selectActivity: (id: string) => void;
    // delete
};

const ActivityList: React.FC<IProps> = ({activities, selectActivity}) => {
    return (
        <Segment clearing>

        <Item.Group divided>
            {activities.map(activity => (

                <Item key={activity.id}>
          {/* <Item.Image size='tiny' src='/images/wireframe/image.png' /> */}

          <Item.Content>
            <Item.Header as='a'>{activity.title}</Item.Header>
            <Item.Meta>{activity.date}</Item.Meta>
            <Item.Description>
              {/* <Image src='/images/wireframe/short-paragraph.png' /> */}
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
            </Item.Description>
            <Item.Extra>
                <Button onClick={() => selectActivity(activity.id)} floated='right' content='View' color='blue' />
                <Label basic content={activity.category} />
            </Item.Extra>
          </Item.Content>
        </Item>
            ))}
      </Item.Group>
        </Segment>
    )
}

export default ActivityList
