import React, { useContext } from 'react'
import ActivityStore from '../../../App/stores/activityStore';
import { Button, Container, Menu } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';



export const NavBar: React.FC = () => {

    const activityStore = useContext(ActivityStore);

    return (
        <Menu fixed='top' inverted>
        <Container>
            <Menu.Item header>
                <img src="/assets/logo.png" alt="logo" style={{marginRight: '10px'}}/>
                Reactivities 
            </Menu.Item>
        
            <Menu.Item name='activites' />

            <Menu.Item>
                <Button onClick={activityStore.openCreateForm} positive content='Create Activity' />
            </Menu.Item>
        </Container>
      </Menu>
    )
}
export default observer(NavBar)