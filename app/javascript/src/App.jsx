import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AboutPage from "./components/AboutPage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { AuthProvider, useAuth } from "./components/commons/AuthContext";
import PrivateRoute from "./components/commons/PrivateRoute";
import EditPost from "./components/Dashboard/EditPost";
import MyPosts from "./components/Dashboard/MyPosts";
import NewPost from "./components/Dashboard/NewPost";
import BlogPosts from "./components/Dashboard/PostsList";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";

const AppRoutes = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Switch>
      <Route exact component={Login} path="/login" />
      <Route exact component={Signup} path="/signup" />
      <PrivateRoute
        exact
        component={HomePage}
        condition={isLoggedIn}
        path="/"
        redirect="/login"
      />
      <Route exact component={AboutPage} path="/about" />
      <PrivateRoute
        exact
        component={BlogPosts}
        condition={isLoggedIn}
        path="/posts"
        redirect="/login"
      />
      <PrivateRoute
        exact
        component={MyPosts}
        condition={isLoggedIn}
        path="/my-posts"
        redirect="/login"
      />
      <PrivateRoute
        exact
        component={NewPost}
        condition={isLoggedIn}
        path="/posts/new"
        redirect="/login"
      />
      <PrivateRoute
        exact
        component={EditPost}
        condition={isLoggedIn}
        path="/posts/:slug/edit"
        redirect="/login"
      />
      <Route exact component={PostDetail} path="/posts/:slug" />
    </Switch>
  );
};

const App = () => (
  <>
    <ToastContainer />
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  </>
);

export default App;
