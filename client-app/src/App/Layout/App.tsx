import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
// import "./styles.css";
import NavBar from "../features/nav/NavBar";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import HomePage from "../features/home/HomePage";
import ActivityDashboard from "../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../features/activities/form/ActivityForm";
import ActivityDetails from "../features/activities/details/ActivityDetails";
import BlogForm from "../features/blogs/form/BlogForm";
import BlogDetails from "../features/blogs/details/BlogDetails";
import BlogDashboard from "../features/blogs/dashboard/BlogDashboard";
import JobForm from "../features/jobs/form/JobForm";
import JobDetails from "../features/jobs/details/JobDetails";
import JobDashboard from "../features/jobs/dashboard/JobDashboard";
import ExperienceForm from "../features/experiences/form/ExperienceForm";

import PostForm from "../features/posts/form/PostForm";
import PostDetails from "../features/posts/details/PostDetails";
import PostDashboard from "../features/posts/dashboard/PostDashboard";

import ProductForm from "../features/products/form/ProductForm";
import ProductDetails from "../features/products/details/ProductDetails";
import ProductDashboard from "../features/products/dashboard/ProductDashboard";

import BusinessForm from "../features/businesses/form/BusinessForm";
import BusinessDetails from "../features/businesses/details/BusinessDetails";
import BusinessDashboard from "../features/businesses/dashboard/BusinessDashboard";
import ExperienceDetails from "../features/experiences/details/ExperienceDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import { RootStoreContext } from "../stores/rootStore";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import RegisterSuccess from "../features/user/RegisterSuccess";
import VerifyEmail from "../features/user/VerifyEmail";
import AboutPage from "../features/about/AboutPage";
import Contact from "../features/about/Contact";
import '@stripe/stripe-js';
const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token && !appLoaded) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token, appLoaded]);
  if (!appLoaded) return <LoadingComponent content="Loading App" />;

  // APP
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <PrivateRoute
                  exact
                  path="/activities"
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path="/activities/:id"
                  component={ActivityDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/activity/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute exact path="/jobs" component={JobDashboard} />
                <PrivateRoute path="/jobs/:id" component={JobDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createJob", "/job/manage/:id"]}
                  component={JobForm}
                />
                <PrivateRoute exact path="/blogs" component={BlogDashboard} />
                <PrivateRoute path="/blogs/:id" component={BlogDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createBlog", "/blog/manage/:id"]}
                  component={BlogForm}
                />
                <PrivateRoute
                  exact
                  path="/products"
                  component={ProductDashboard}
                />
                <PrivateRoute path="/products/:id" component={ProductDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createProduct", "/product/manage/:id"]}
                  component={ProductForm}
                />
                <PrivateRoute exact path="/programs" component={PostDashboard} />
                <PrivateRoute path="/programs/:id" component={PostDetails} />
                <PrivateRoute
                  key={location.key}
                  path={["/createProgram", "/program/manage/:id"]}
                  component={PostForm}
                />
                <PrivateRoute
                  exact
                  path="/businesses"
                  component={BusinessDashboard}
                />
                <PrivateRoute
                  path="/businesses/:id"
                  component={BusinessDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={["/createBusiness", "/business/manage/:id"]}
                  component={BusinessForm}
                />
                 <PrivateRoute
                  path="/experiences/:id"
                  component={ExperienceDetails}
                />
                <PrivateRoute
                  key={location.key}
                  path={["/createExperience", "/experience/manage/:id"]}
                  component={ExperienceForm}
                />
                  <PrivateRoute
                  exact
                  path="/about"
                  component={AboutPage}
                />
                <PrivateRoute
                  path="/profile/:username"
                  component={ProfilePage}
                />
                <Route path="/contact" component={Contact} />
                <Route
                  path="/user/registerSuccess"
                  component={RegisterSuccess}
                />
                <Route path="/user/verifyEmail" component={VerifyEmail} />{" "}
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
