import React from 'react';
import storeProvider from './storeProvider';
import '../styles/signInButton.css';
import Typography from 'material-ui/Typography';

class Login extends React.PureComponent {

  componentDidMount() {
    this.props.initializeGoogleApiAndRenderSignInButton();
  }

  render() {
    const { user } = this.props;
    return (
      <React.Fragment>
        <Typography variant="display1" gutterBottom align="center">
          Log In
        </Typography>
        {!user.isSignedIn &&
          <div>
            <div id="googleSigninButton"></div>
            <div>{user.signInError}</div>
          </div>
        }
      </React.Fragment>
    );
  }
}

function extraProps(props, store) {
  return {
    user: store.getState().user,
    initializeGoogleApiAndRenderSignInButton: () => {
      store.initializeGoogleApiAndRenderSignInButton();
    }
  };
}

export default storeProvider(extraProps)(Login);