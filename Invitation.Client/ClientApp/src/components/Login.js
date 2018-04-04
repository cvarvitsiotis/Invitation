import React from 'react';
import storeProvider from './storeProvider';
import{ CardContent, CardHeader } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import CardWithStyle from './overrides/CardWithStyle';
import red from 'material-ui/colors/red';

const styles = theme => ({
  button: {
    display: 'flex',
    justifyContent: 'center'
  },
  connectingToGoogle: {
    ...theme.typography.body1,
    color: theme.palette.primary.main
  },
  signInError: {
    ...theme.typography.body1,
    color: red['A700']
  }
});

class Login extends React.PureComponent {
  componentDidMount() {
    this.props.initializeGoogleApiAndRenderSignInButton();
  }

  render() {
    const { user, classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader align="center" title="Log In" />
        <CardContent>
          {!user.isSignedIn &&
            <div className={classes.button}>
              <div id="googleSigninButton" className={classes.connectingToGoogle}>Connecting to Google...</div>
              <div className={classes.signInError}>{user.signInError}</div>
            </div>
          }
        </CardContent>
      </CardWithStyle>
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

export default withStyles(styles)(storeProvider(extraProps)(Login));