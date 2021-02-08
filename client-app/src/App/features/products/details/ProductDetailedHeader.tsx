import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react'
import { IProduct } from '../../../models/product';
import {format} from 'date-fns';
import { RootStoreContext } from '../../../stores/rootStore';

const productImageStyle = {
  filter: 'brightness(30%)'
};

const productImageTextStyle = {
  position: 'absolute',
  bottom: '5%',
  left: '5%',
  width: '100%',
  height: 'auto',
  color: 'white'
};

const ProductDetailedHeader: React.FC<{product: IProduct}> = ({product}) => {
  const host = product.liked.filter(x => x.isHost)[0];
  const rootStore = useContext(RootStoreContext);
  const { likeProduct, unlikeProduct, loadingProduct } = rootStore.productStore;
    return (
        <Segment.Group>
          <Segment basic attached='top' style={{ padding: '0' }}>
            <Image src={`/assets/categoryImages/${product.category}.jpg`} fluid style={productImageStyle}/>
            <Segment basic style={productImageTextStyle}>
              <Item.Group>
                <Item>
                  <Item.Content>
                    <Header
                      size='huge'
                      content={product.title}
                      style={{ color: 'white' }}
                    />
                    <p>{format(product.date, 'eeee do MMMM')}</p>
                    <p>
                    Hosted by {' '}
                    <Link to={`/profile/${host.username}`}>
                      <strong>{host.displayName}</strong>
                    </Link>
                    </p>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Segment>
          </Segment>
          <Segment clearing attached='bottom'>
            {product.isHost ? (
              <Button as={Link} to={`/product/manage/${product.id}`} color='orange' floated='right'>
              Manage Event
            </Button>
              ) : product.isLiked ? (
                <Button loading={loadingProduct} onClick={unlikeProduct}>Cancel attendance</Button>
                ) : (
                <Button loading={loadingProduct} onClick={likeProduct} color='grey'>Join product</Button>
              )}
          </Segment>
        </Segment.Group>
    );
};

export default observer(ProductDetailedHeader);
