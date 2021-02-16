import React from 'react'
import { Grid, Header, Segment, Image } from "semantic-ui-react";

const Donations = () => {
    return (
        <>
        <Segment clearing>
        <Header size='large' textAlign='center'>Donations</Header>
        <Image 
            src='/assets/categoryImages/culture.jpg' 
            fluid
            as='a'
            href={'/blogs'}
            />
             <Header size='medium' textAlign='center'>PTSD</Header>
    </Segment>
    <Segment clearing>
        
        <Image 
            src='/assets/categoryImages/drinks.jpg' 
            fluid
            as='a'
            href={'/blogs'}
            />
             <Header size='medium' textAlign='center'>Airline and miluim</Header>
    </Segment>
    </>
    )
}

export default Donations
