import React from 'react';
import storeProvider from './storeProvider';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.PureComponent {
  render() {
    const { component: Component, userIsAuthenticated, ...rest } = this.props;
    return (
      <Route {...rest} render={props =>
        userIsAuthenticated ? <Component {...props} /> : <Redirect to='/' />
      }/>
    );
  }
}

function extraProps(props, store) {
  return {
    userIsAuthenticated: store.getState().userIsAuthenticated
  };
}

export default storeProvider(extraProps)(PrivateRoute);