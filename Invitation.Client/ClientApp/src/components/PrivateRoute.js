import React from 'react';
import storeProvider from './storeProvider';
import { Route, Redirect } from 'react-router-dom';

class PrivateRoute extends React.PureComponent {
  render() {
    const { component: Component, userId, ...rest } = this.props;
    return (
      <Route {...rest} render={props =>
        userId ? <Component {...props} /> : <Redirect to='/' />
      }/>
    );
  }
}

function extraProps(props, store) {
  return {
    userId: store.getState().userId
  };
}

export default storeProvider(extraProps)(PrivateRoute);