import React from 'react'
import { Grid, Header, Segment, Image } from "semantic-ui-react";
const AboutLeft = () => {
    return (
        <Segment clearing>
            <Image 
                src='/assets/loneVeterans/logoBigSharp.png' 
                fluid
                as='a'
                href={'/blogs'}
                />
                 <Header size='medium' textAlign='center'>We are commmited to giving the best to the those who served</Header>
        </Segment>
    )
}

export default AboutLeft
