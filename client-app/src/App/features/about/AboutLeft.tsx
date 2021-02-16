import React from 'react'
import { Grid, Header, Segment, Image } from "semantic-ui-react";
const AboutLeft = () => {
    return (
        <>
        <Segment clearing>
            <Image 
                src='/assets/loneVeterans/logoBigSharp.png' 
                fluid
                as='a'
                href={'/blogs'}
                />
                 <Header size='medium' textAlign='center'>We are commmited to giving the best to the those who served</Header>
        </Segment>
                <Segment clearing>
                <Header size='large' textAlign='center'>Blogs</Header>
                <Image 
                    src='/assets/categoryImages/culture.jpg' 
                    fluid
                    as='a'
                    href={'/blogs'}
                    />
                     <Header size='medium' textAlign='center'>Checkout our community</Header>
            </Segment>
            <Segment clearing>
                <Header size='large' textAlign='center'>Businesses</Header>
                <Image 
                    src='/assets/categoryImages/drinks.jpg' 
                    fluid
                    as='a'
                    href={'/businesses'}
                    />
                     <Header size='medium' textAlign='center'>Our wide variety of community members reach all over the world</Header>
            </Segment>
            </>
    )
}

export default AboutLeft
