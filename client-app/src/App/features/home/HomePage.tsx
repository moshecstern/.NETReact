import React, { Fragment, useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Segment, Image } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import LoginForm from "../user/LoginForm";
import RegisterForm from "../user/RegisterForm";

// import ActivityDashboard from '../activities/dashboard/ActivityDashboard';

const HomePage = () => {
  const token = window.localStorage.getItem('jwt');
  const rootStore = useContext(RootStoreContext);
  const {user, isLoggedIn } = rootStore.userStore;
  const {openModal} = rootStore.modalStore;

  return (
    <Segment inverted textAlign="center" vertical className="masthead">
      <Container text>
        {/* <Header as="h1" inverted>
          Lone Veterans
        </Header> */}
          <Image
            size="massive"
            src="/assets/loneVeterans/logoBigSharp.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
        {isLoggedIn && user && token ? (
          <Fragment>
            <Header as="h2" inverted content={`Welcome back ${user.displayName}`} />
            <Button as={Link} to="/activities" size="huge" inverted>
          Go to Events
        </Button>
        <Button as={Link} to="/blogs" size="huge" inverted>
          Go to Blogs
        </Button>
        <Button as={Link} to="/jobs" size="huge" inverted>
          Go to Jobs
        </Button>
        <Button as={Link} to="/businesses" size="huge" inverted>
          Go to Businesses
        </Button>
        <Button as={Link} to="/posts" size="huge" inverted>
          Go to Posts
        </Button>
        <Button as={Link} to="/products" size="huge" inverted>
          Go to Store
        </Button>
          </Fragment>
        ) : (

          <Fragment>
        <Header as="h2" inverted content="Welcome to Lone Veterans" />
        <Button onClick={() => openModal(<LoginForm />)} size="huge" inverted>
          Login
        </Button>
        <Button onClick={() => openModal(<RegisterForm />)} size="huge" inverted>
          Register
        </Button>
        </Fragment>
          )}

      </Container>
    </Segment>
  );
};

export default HomePage;