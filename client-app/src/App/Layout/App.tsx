  import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
  import { Container, Header, Icon } from "semantic-ui-react";
  import "./styles.css";
  import { IActivity } from "../Models/activity";
  import NavBar from "../features/nav/NavBar";
  import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
  import  Agent  from "../api/agent";
  import LoadingComponent from "./LoadingComponent";

  const App = () => {

    // STATE
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
      null
    );
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [target, setTarget] = useState('');

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
      setSubmitting(true);
      Agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity]);
        // spreading out existing array and adding this oone to it
        setSelectedActivity(activity);
        setEditMode(false);
      }).then(() => setSubmitting(false))
    }
    
    const handleEditActivity = (activity: IActivity) => {
      setSubmitting(true);
      Agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity]);
        // spreading out existing array and filter out the one we are updating, then add to that one
        setSelectedActivity(activity);
        setEditMode(false);
      }).then(() => setSubmitting(false))
    }
    
    const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
      setTarget(event.currentTarget.name)
      setSubmitting(true);
      Agent.Activities.delete(id).then(() => {
        setActivities([...activities.filter((a) => a.id !== id)])
      }).then(() => setSubmitting(false))
    };
    
    // LIFECYCLE
    useEffect(() => {
      Agent.Activities.list()
      .then(response => {
          let activities: IActivity[] = [];
          // datetime
          response.forEach((activity) => {
            activity.date = activity.date.split('.')[0];
            activities.push(activity);
          })
          setActivities(activities);
        }).then(()=> setLoading(false));
    }, []);

    if (loading) return <LoadingComponent content='Loading activities...'/>
    // APP
    return (
      // <div className="app">
      <Fragment>
        <Container style={{ marginTop: '7em'}}>
          
        <NavBar openCreateForm={handleOpenCreateForm} />
    
          
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
              submitting={submitting}
              target={target}
              />
              </Container>

    
       
      </Fragment>
    );
  };

  export default App;
