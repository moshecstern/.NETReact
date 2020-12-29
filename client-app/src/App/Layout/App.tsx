import React, { useEffect, Fragment, useContext } from "react";
import { Container, Header, Icon } from "semantic-ui-react";
import "./styles.css";

import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {
  // MOBX
  const activityStore = useContext(ActivityStore);

  // LIFECYCLE
  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial)
    return <LoadingComponent content="Loading activities..." />;
  // APP
  return (
    // <div className="app">
    <Fragment>
      <Container style={{ marginTop: "7em" }}>
        <NavBar />

        <Header as="h2" icon>
          <Icon name="users" />
          <Header.Content>NET REACT FUNTIMES</Header.Content>
          <Header.Subheader>
            Manage your account settings and set e-mail preferences.
          </Header.Subheader>
        </Header>

        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
