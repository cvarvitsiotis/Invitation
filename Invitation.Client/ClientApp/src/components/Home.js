import React from 'react';
import storeProvider from './storeProvider';

class Home extends React.PureComponent {
  render() {
    const { userIsAuthenticated, signIn } = this.props;
    return (
      <div className="text-center">
        <h3 className="text-primary font-weight-light">Let&#39;s get started!</h3>
        {!userIsAuthenticated &&
          <button type="button" className="btn btn-outline-primary mt-2" onClick={signIn}>Sign in with Google</button>
        }
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    userIsAuthenticated: store.getState().userIsAuthenticated,
    signIn: () => {
      store.signIn();
    }
  };
}

export default storeProvider(extraProps)(Home);