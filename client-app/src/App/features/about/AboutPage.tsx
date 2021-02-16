import React from 'react'
import { Grid, Header } from "semantic-ui-react";
import Payment from './Payment';
import AbouLeft from './AboutLeft';
import AboutLeft from './AboutLeft';
import Contact from './Contact';
import Donations from './Donations';

const AboutPage = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
            <Header size='large' textAlign='center'>About Us</Header>
            <AboutLeft />
            </Grid.Column>
            <Grid.Column width={6}>
                <Header size='large' textAlign='center'>Donate Today</Header>
                <Header size='medium' textAlign='center'>Not Available Yet!</Header>
                <Payment />
                <hr />
                <br />
                <Header size='large' textAlign='center'>We would love to speak with you</Header>
                <Contact />
                <hr />
                <br />
                <Donations />
        </Grid.Column>
        </Grid>
    )
}

export default AboutPage
