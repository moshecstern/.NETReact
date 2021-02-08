import React from "react";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";
// import productstore from "../../../../App/stores/productstore";
import { IProduct } from "../../../models/product";
import {format} from 'date-fns'
import ProductListItemAttendees from './ProductListItemAttendees';
// import { RootStore } from "../../../stores/rootStore";

const ProductListItem: React.FC<{ product: IProduct }> = ({ product }) => {
  const host = product.liked.filter(x => x.isHost)[0];
  return (
    <Segment.Group>
      <Segment>
          <Item.Group>
        <Item>
          <Item.Image size="tiny" circular src={host.image || "/assets/user.png"} />
          <Item.Content>
            <Item.Header as={Link} to={`/products/${product.id}`}>{product.title}</Item.Header>
            <Item.Description>
            Hosted By 
            <Link to={`/profile/${host.username}`}>
            {host.displayName}
            </Link>
            </Item.Description>
            {product.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You are hosting this product'
              />
            </Item.Description>
              }
                {product.liked && !product.isHost &&
            <Item.Description>
              <Label 
                basic
                color='orange'
                content='You liked this product'
              />
            </Item.Description>
              }
          
          </Item.Content>
        </Item>

          </Item.Group>
      </Segment>
      <Segment>
          <Icon name='clock' /> {format(product.date, 'H:mm a')}
          {/* <Icon name='marker' /> {product.venue}, {product.city} */}
      </Segment>
      <Segment secondary>
            <ProductListItemAttendees
              peopleWhoLiked={product.liked}
            />
      </Segment>
      <Segment clearing>
          <span>{product.description}</span>
          <Button
                as={Link}
                to={`/products/${product.id}`}
                floated="right"
                content="View"
                color="black"
              />
      </Segment>
    </Segment.Group>
  );
};

export default ProductListItem;
