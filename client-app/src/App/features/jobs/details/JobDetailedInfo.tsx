import React from 'react';
import { Segment, Grid, Icon } from 'semantic-ui-react';
import { IJob } from '../../../models/jobs';
import {format} from 'date-fns';

const JobDetailedInfo: React.FC<{job: IJob}> = ({job}) => {
    return (
        <div>
            <Segment.Group>
                  <Segment attached='top'>
                    <Grid>
                      <Grid.Column width={1}>
                        <Icon size='large' color='grey' name='info' />
                      </Grid.Column>
                      <Grid.Column width={15}>
                        <p>{job.description}</p>
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
                          {format(job.date, 'eeee do MMMM')} at {format(job.date, 'h:mm a')}
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
                        <span> {job.city}</span>
                      </Grid.Column>
                    </Grid>
                  </Segment>
                </Segment.Group>
        </div>
    )
}

export default JobDetailedInfo
