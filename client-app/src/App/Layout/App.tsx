import React, { useState, useEffect, Fragment } from "react";
import { Container, Header, Icon, List } from "semantic-ui-react";
import "./styles.css";
import { IActivity } from "../Models/activity";
import axios from "axios";
import NavBar from "../features/nav/NavBar";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";

const App = () => {
                       // STATE
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivities,] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

                      // FUNCTIONS
  // const handleDeleteActivity = (id: string) => {
  //   setActivities([...activities.filter((a) => a.id !== id)])
  // };
  const handleSelectActivity = (id: string) => {
    setSelectedActivities(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };
                      // LIFECYCLE
  useEffect(() => {
    axios
      .get<IActivity[]>("http://localhost:5000/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);
                       // APP
  return (
    // <div className="app">
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <div>
          <Header as="h2" icon>
            <Icon name="users" />
            <Header.Content>NET REACT FUNTIMES</Header.Content>
            <Header.Subheader>
              Manage your account settings and set e-mail preferences.
            </Header.Subheader>
          </Header>

          <ActivityDashboard
            activities={activities}
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivities}
          />
        </div>
      </Container>
    </Fragment>
  );
};

export default App;
