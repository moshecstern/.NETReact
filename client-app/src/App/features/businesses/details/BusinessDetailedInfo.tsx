import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IBusiness } from '../../../models/business'
import {format} from 'date-fns'


const BusinessDetailedInfo: React.FC<{Business: IBusiness}> = ({Business}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='grey' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{Business.description}</p>
                        <p>{Business.featuredPost}</p>
                        
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
                          {format(Business.date, 'eeee do MMMM')} at {format(Business.date, 'h:mm a')}
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
                        <span>{Business.website}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default BusinessDetailedInfo
