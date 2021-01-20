import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IPost } from '../../../models/post'
import {format} from 'date-fns'


const PostDetailedInfo: React.FC<{post: IPost}> = ({post}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='teal' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{post.description}</p>
                        <p>{post.main}</p>
                        
                      </Grid.Column>
                    </Grid>
                  </Segment>
                  <Segment attached>
                    <Grid verticalAlign='middle'>
                      <Grid.Column width={1}>
                        <Icon name='calendar' size='large' color='teal' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <span>
                          {format(post.date, 'eeee do MMMM')} at {format(post.date, 'h:mm a')}
                        </span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                  <Segment attached>
                    <Grid verticalAlign='middle'>
                      <Grid.Column width={1}>
                        <Icon name='marker' size='large' color='teal' />
                      </Grid.Column>
                      <Grid.Column width={11}>
                        <span>{post.main2}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default PostDetailedInfo
