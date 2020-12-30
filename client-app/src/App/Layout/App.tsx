import React, { Fragment } from "react";
import { Container, Header, Icon } from "semantic-ui-react";
import "./styles.css";
import NavBar from "../features/nav/NavBar";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import HomePage from "../features/home/HomePage";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDetails from "../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

const App: React.FC<RouteComponentProps> = ({ location }) => {

  // APP
  return (
    // <div className="app">
    <Fragment>
      <ToastContainer position='bottom-right'/>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
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
              <Switch>

              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
                />
              <Route  component={NotFound} />
                </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
