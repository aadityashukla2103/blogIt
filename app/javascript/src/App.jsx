import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AboutPage from "./components/AboutPage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import EditPost from "./components/Dashboard/EditPost";
import MyPosts from "./components/Dashboard/MyPosts";
import NewPost from "./components/Dashboard/NewPost";
import BlogPosts from "./components/Dashboard/PostsList";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";

const App = () => (
  <>
    <ToastContainer />
    <Router>
      <Switch>
        <Route exact component={Login} path="/login" />
        <Route exact component={Signup} path="/signup" />
        <Route exact component={HomePage} path="/" />
        <Route exact path="/about" render={() => <AboutPage />} />
        <Route exact path="/posts" render={() => <BlogPosts />} />
        <Route exact path="/my-posts" render={() => <MyPosts />} />
        <Route exact path="/posts/new" render={() => <NewPost />} />
        <Route exact component={EditPost} path="/posts/:slug/edit" />
        <Route exact path="/posts/:slug" render={() => <PostDetail />} />
      </Switch>
    </Router>
  </>
);

export default App;
