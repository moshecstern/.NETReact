import React from 'react';
import logo from './logo.svg';
import './App.css';

import { Header, Icon } from 'semantic-ui-react'

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
const App: React.FC = () => {
  return (
    <div className="app">
        <Header as='h2' icon>
    <Icon name='settings' />
   NET REACT FUNTIMES
    <Header.Subheader>
      Manage your account settings and set e-mail preferences.
    </Header.Subheader>
  </Header>
    </div>
  )
}

export default App;
