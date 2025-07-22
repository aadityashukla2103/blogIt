import React from "react";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AboutPage from "./components/AboutPage";
import NewPost from "./components/Dashboard/NewPost";
import BlogPosts from "./components/Dashboard/PostsList";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";
import Sidebar from "./components/Sidebar";

const App = () => (
  <>
    <ToastContainer />
    <Router>
      <div className="min-h-screen bg-white">
        <Sidebar />
        <div className="md:ml-16">
          <Switch>
            <Route exact path="/" render={() => <HomePage />} />
            <Route exact path="/about" render={() => <AboutPage />} />
            <Route exact path="/posts" render={() => <BlogPosts />} />
            <Route exact path="/posts/new" render={() => <NewPost />} />
            <Route path="/posts/:slug" render={() => <PostDetail />} />
          </Switch>
        </div>
      </div>
    </Router>
  </>
);

export default App;
