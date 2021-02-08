import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import businessestore from "../../../../App/stores/businessestore";
import { IBusiness } from "../../../models/business";
import {format} from 'date-fns'
import BusinessListItemAttendees from './BusinessListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const BusinessListItem: React.FC<{ Business: IBusiness }> = ({ Business }) => {
  const host = Business.liked.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/businesses/${Business.id}`}>{Business.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {Business.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this Business'
              />
            </Item.Description>
              }
                {Business.liked && !Business.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You liked this Business'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(new Date(Business.date), 'H:mm a')}
          {/* <Icon name='marker' /> {Business.venue}, {Business.city} */}
      </Segment>
      <Segment secondary>
            <BusinessListItemAttendees
              peopleWhoLiked={Business.liked}
            />
      </Segment>
      <Segment clearing>
          <span>{Business.description}</span>
          <Button
                as={Link}
                to={`/businesses/${Business.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default BusinessListItem;
