import React from 'react';
import storeProvider from './storeProvider';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.PureComponent {
  render() {
    const { component: Component, user, ...rest } = this.props;
    return (
      <Route {...rest} render={props =>
        (user.isAuthenticated && user.hasAuthorized) ? <Component {...props} /> : <Redirect to='/' />
      }/>
    );
  }
}

function extraProps(props, store) {
  return {
    user: store.getState().user
  };
}

export default storeProvider(extraProps)(PrivateRoute);