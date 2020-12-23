import React, { useState, useEffect} from 'react';
import { Header, Icon, List } from 'semantic-ui-react';
// import './styles.css';
import { IActivity } from '../Models/activity';
import axios from 'axios';

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
 
  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then(response => {
        setActivities(response.data)
      });

  }, []);

  return (
    // <div className="app">
    <div>
        <Header as='h2' icon>
    <Icon name='users' />
      <Header.Content>
        NET REACT FUNTIMES
      </Header.Content>
    <Header.Subheader>
      Manage your account settings and set e-mail preferences.
    </Header.Subheader>
  </Header>
      <List>
        {activities.map(activity => (
          <List.Item key={activity.id}>
            {activity.title}
          </List.Item>
        ))}
      </List>
    </div>
  )
}

export default App;
