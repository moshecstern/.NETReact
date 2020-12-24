  import React, { useState, useEffect, Fragment } from "react";
  import { Container, Header, Icon } from "semantic-ui-react";
  import "./styles.css";
  import { IActivity } from "../Models/activity";
  import axios from "axios";
  import NavBar from "../features/nav/NavBar";
  import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";

  const App = () => {

    // STATE
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
      null
    );
    const [editMode, setEditMode] = useState(false);


    // FUNCTIONS
    const handleSelectActivity = (id: string) => {
      setSelectedActivity(activities.filter((a) => a.id === id)[0]);
      setEditMode(false);
    };
    
    const handleOpenCreateForm = () => {
      setSelectedActivity(null);
      setEditMode(true);
    }
    
    const handleCreateActivity = (activity: IActivity) => {
      setActivities([...activities, activity]);
      // spreading out existing array and adding this oone to it
      setSelectedActivity(activity);
      setEditMode(false);
    }
    
    const handleEditActivity = (activity: IActivity) => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      // spreading out existing array and filter out the one we are updating, then add to that one
      setSelectedActivity(activity);
      setEditMode(false);
    }
    
    const handleDeleteActivity = (id: string) => {
      setActivities([...activities.filter((a) => a.id !== id)])
    };
    
    // LIFECYCLE
    useEffect(() => {
      axios
        .get<IActivity[]>("http://localhost:5000/api/activities")
        .then((response) => {
          let activities: IActivity[] = [];
          // datetime
          response.data.forEach(activity => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity);
          })
          setActivities(activities);
        });
    }, []);


    // APP
    return (
      // <div className="app">
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm} />
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
              setSelectedActivity={setSelectedActivity}
              createActivity={handleCreateActivity}
              editActivity={handleEditActivity}
              deleteActivity={handleDeleteActivity}
            />
          </div>
        </Container>
      </Fragment>
    );
  };

  export default App;
