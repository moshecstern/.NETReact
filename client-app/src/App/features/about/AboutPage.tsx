import React from 'react'
import { Grid, Header } from "semantic-ui-react";
import Payment from './Payment';
const AboutPage = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
           <h2>About Us</h2> 
            </Grid.Column>
            <Grid.Column width={6}>
                <Header size='large' textAlign='center'>Donate Today</Header>
                <Header size='medium' textAlign='center'>Not Available Yet!</Header>
                <Payment />
        </Grid.Column>
        </Grid>
    )
}

export default AboutPage
