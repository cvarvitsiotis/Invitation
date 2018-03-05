import React from 'react';
import storeProvider from './storeProvider';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.PureComponent {
  render() {
    const { component: Component, isAuthenticated, ...rest } = this.props;
    return (
      <Route {...rest} render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to='/login' />
      }/>
    );
  }
}

function extraProps(props, store) {
  return {
    isAuthenticated: store.getState().isAuthenticated
  };
}

export default storeProvider(extraProps)(PrivateRoute);