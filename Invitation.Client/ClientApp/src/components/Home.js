import React from 'react';
import storeProvider from './storeProvider';
import '../styles/signInButton.css';

class Home extends React.PureComponent {

  componentDidMount() {
    this.props.initializeGoogleApiAndRenderSignInButton();
  }

  render() {
    const { user, signIn } = this.props;
    return (
      <div className="text-center">
        <h3 className="text-primary font-weight-light">Let&#39;s get started!</h3>
        {!user.isSignedIn &&
          <div>
            <div className="mt-4" id="googleSigninButton"></div>
            <div className="mt-4">{user.signInError}</div>
          </div>
        }
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    user: store.getState().user,
    initializeGoogleApiAndRenderSignInButton: () => {
      store.initializeGoogleApiAndRenderSignInButton();
    },
    signIn: () => {
      store.signIn();
    }
  };
}

export default storeProvider(extraProps)(Home);