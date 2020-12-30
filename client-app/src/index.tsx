import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import {createBrowserHistory} from 'history';
import 'react-toastify/dist/ReactToastify.min.css'
import App from './App/Layout/App';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from './App/Layout/ScrollToTop';

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
reportWebVitals();
