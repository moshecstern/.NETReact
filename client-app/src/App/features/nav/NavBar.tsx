import React from 'react'

import { Button, Container, Menu } from 'semantic-ui-react';



export const NavBar = () => {
    return (
        <Menu fixed='top' inverted>
        <Container>
            <Menu.Item header>
                <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                Reactivities 
            </Menu.Item>
        
            <Menu.Item name='activites' />

            <Menu.Item>
                <Button positive content='Create Activity' />
            </Menu.Item>
        </Container>
      </Menu>
    )
}
export default NavBar