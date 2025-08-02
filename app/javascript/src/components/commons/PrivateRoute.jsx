import React from "react";

import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  condition,
  exact,
  path,
  redirect,
  ...props
}) => {
  if (!condition) {
    return (
      <Redirect
        to={{
          pathname: redirect,
          state: { from: props.location },
        }}
      />
    );
  }

  return <Route component={Component} exact={exact} path={path} {...props} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.func,
  condition: PropTypes.bool,
  exact: PropTypes.bool,
  location: PropTypes.object,
  path: PropTypes.string,
  redirect: PropTypes.string,
};

export default PrivateRoute;
