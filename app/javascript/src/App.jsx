import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import AboutPage from "./components/AboutPage";
import BlogPosts from "./components/Dashboard/PostsList";
import HomePage from "./components/HomePage";
import PostDetail from "./components/PostDetail";
import Sidebar from "./components/Sidebar";

const App = () => (
  <Router>
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="md:ml-20">
        <Switch>
          <Route exact path="/" render={() => <HomePage />} />
          <Route exact path="/about" render={() => <AboutPage />} />
          <Route exact path="/posts" render={() => <BlogPosts />} />
          <Route path="/posts/:slug" render={() => <PostDetail />} />
        </Switch>
      </div>
    </div>
  </Router>
);

export default App;
