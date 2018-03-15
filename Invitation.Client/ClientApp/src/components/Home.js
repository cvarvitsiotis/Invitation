import React from 'react';
import storeProvider from './storeProvider';
import '../styles/signInButton.css';

class Home extends React.PureComponent {
  render() {
    const { userIsAuthenticated, signIn } = this.props;
    return (
      <div className="text-center">
        <h3 className="text-primary font-weight-light">Let&#39;s get started!</h3>
        {!userIsAuthenticated &&
          <div className="g-signin2 mt-4" onClick={signIn}></div>
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