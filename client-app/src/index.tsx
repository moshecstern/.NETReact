// import React from 'react'
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import 'semantic-ui-css/semantic.min.css'
import App from './App/Layout/App';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from './App/Layout/ScrollToTop';
import dateFnsLocalizer from 'react-widgets-date-fns';
import * as serviceWorker from './serviceWorker';
import './App/Layout/styles.css';
import 'mobx-react-lite/batchingForReactDom';

dateFnsLocalizer();

export const history = createBrowserHistory();

ReactDOM.render(
  // <React.StrictMode>
    <Router history={history}>
     <ScrollToTop>
    <App />
     </ScrollToTop>
     </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// https://github.com/TryCatchLearn/Reactivities30
reportWebVitals();
serviceWorker.unregister();
