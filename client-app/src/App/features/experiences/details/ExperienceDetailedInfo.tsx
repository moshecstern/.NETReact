import React from 'react'
import { Segment, Grid, Icon } from 'semantic-ui-react'
import { IExperience } from '../../../models/experience'
import {format} from 'date-fns'


const ExperienceDetailedInfo: React.FC<{Experience: IExperience}> = ({Experience}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='grey' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{Experience.main}</p>
                        <p>{Experience.main2}</p>
                        
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
                          {format(new Date(Experience.date), 'eeee do MMMM')} 
                          at {format(new Date(Experience.date), 'h:mm a')}
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
                        <span>{Experience.link1}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default ExperienceDetailedInfo
