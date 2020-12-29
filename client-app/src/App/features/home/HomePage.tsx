import React from 'react'
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
// import ActivityDashboard from '../activities/dashboard/ActivityDashboard';

const HomePage = () => {
    return (
        
        <Container style={{ marginTop: "7em" }}>
            <h1>Home Page</h1>
            <h3>Got to <Link to='/activities'>Activities</Link></h3>
            {/* <ActivityDashboard /> */}
        </Container>


    );
};

export default HomePage
