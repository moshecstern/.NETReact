import React, { useContext } from "react";
import { Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { NavLink, Link } from "react-router-dom";
import { RootStoreContext } from "../../stores/rootStore";

export const NavBar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const {user, logout } = rootStore.userStore;
  
  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item header as={NavLink} exact to={"/"}>
          <img
            src="/assets/loneVeterans/logoSmallClose.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Lone Veterans
        </Menu.Item>
        <Menu.Item name="about" as={NavLink} to={"/about"} />
        <Menu.Item name="blogs" as={NavLink} to={"/blogs"} />
        <Menu.Item name="events" as={NavLink} to={"/activities"} />
        <Menu.Item name="jobs" as={NavLink} to={"/jobs"} />
        <Menu.Item name="businesses" as={NavLink} to={"/businesses"} />
        <Menu.Item name="programs" as={NavLink} to={"/programs"} />
        <Menu.Item name="store" as={NavLink} to={"/products"} />
        <Menu.Item name="contact" as={NavLink} to={"/contact"} />

        {/* <Menu.Item>
          <Button
            as={NavLink}
            to={"/createActivity"}
            positive
            content="Create Activity"
          />
        </Menu.Item> */}

      {user && (
        <Menu.Item position='right'>
          <Image avatar spaced='right' src={user.image || '/assets/user.png'} />
          <Dropdown pointing='top left' text={user.displayName}>
            <Dropdown.Menu>
              <Dropdown.Item 
              as={Link}
              to={`/profile/${user.username}`}
              text='My profile'
              icon='user'
              />
              <Dropdown.Item onClick={logout} text='Logout' icon='power' />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      )}

      </Container>
    </Menu>
  );
};
export default observer(NavBar);
