import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IProduct } from '../../../models/product'
import {format} from 'date-fns'


const ProductDetailedInfo: React.FC<{product: IProduct}> = ({product}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='grey' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{product.description}</p>
                
                        <p>Made By: {product.madeBy}</p>
                        
                      </Grid.Column>
                    </Grid>
                  </Segment>
                  <Segment attached>
                    <Grid verticalAlign='middle'>
                      <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='grey' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <span>
                          {format(product.date, 'eeee do MMMM')} at {format(product.date, 'h:mm a')}
                        </span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                  <Segment attached>
                    <Grid verticalAlign='middle'>
                      <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='grey' />
                      </Grid.Column>
                      <Grid.Column width={11}>
                        <span>{product.category}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default ProductDetailedInfo
