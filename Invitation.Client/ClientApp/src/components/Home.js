import React from 'react';
import storeProvider from './storeProvider';

class Home extends React.PureComponent {
  render() {
    const { userId, signIn } = this.props;
    return (
      <div className="text-center">
        <h3 className="text-primary font-weight-light">Let&#39;s get started!</h3>
        {!userId &&
          <button type="button" className="btn btn-outline-primary mt-2" onClick={signIn}>Sign in with Google</button>
        }
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    userId: store.getState().userId,
    signIn: () => {
      store.signIn();
    }
  };
}

export default storeProvider(extraProps)(Home);