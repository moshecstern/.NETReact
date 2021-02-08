import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IBlog } from '../../../models/blog'
import {format} from 'date-fns'


const BlogDetailedInfo: React.FC<{blog: IBlog}> = ({blog}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='grey' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{blog.description}</p>
                        <p>{blog.main}</p>
                        
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
                          {format(blog.date, 'eeee do MMMM')} at {format(blog.date, 'h:mm a')}
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
                        <span>{blog.main2}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default BlogDetailedInfo
