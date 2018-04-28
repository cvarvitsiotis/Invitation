import React from 'react';
import storeProvider from './storeProvider';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import AccountCircleIcon from 'material-ui-icons/AccountCircle';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import { withStyles } from 'material-ui/styles';

const reViewEvent = /^\/events\/\d+$/;
const reAddPerson = /^\/events\/\d+\/addPerson$/;
const reSendMessage = /^\/events\/\d+\/addMessage$/;

const AppbarTitle = location => {
  if (location.pathname === '/events') return 'Events';
  if (reViewEvent.test(location.pathname)) return 'View Event';
  if (reAddPerson.test(location.pathname)) return 'Select Person';
  if (reSendMessage.test(location.pathname)) return 'Send Message';
  if (location.pathname === '/addEvent') return 'New Event';
  return 'Invitation';
};

const styles = theme => ({
  flex: {
    flex: 1,
  },
  checkvronLeft: {
    marginLeft: -theme.spacing.unit * 1.5,
    marginRight: theme.spacing.unit * 2.5
  }
});

class Appbar extends React.PureComponent {
  state = {
    menuAnchorEl: null,
  };

  onAvatarClick = event => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  onMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  onSignOutClick = () => {
    this.onMenuClose();
    this.props.signOut();
  };

  render() {
    const { user, location, goBack, classes } = this.props;
    const { menuAnchorEl } = this.state;
    const open = Boolean(menuAnchorEl);

    return (
      <AppBar position="static">
        <Toolbar>
          {(reViewEvent.test(location.pathname) || reAddPerson.test(location.pathname)) &&
            <IconButton className={classes.checkvronLeft} color="inherit">
              <ChevronLeftIcon onClick={goBack}/>
            </IconButton>
          }
          <Typography variant="title" color="inherit" className={classes.flex}>{AppbarTitle(location)}</Typography>
          <div>
            {!user.isSignedIn && user.picture &&
              <Avatar src={user.picture} />
            }
            {user.isSignedIn &&
              <div>
                <IconButton color="inherit" onClick={this.onAvatarClick}>
                  {user.picture &&
                    <Avatar src={user.picture} />
                  }
                  {!user.picture &&
                    <AccountCircleIcon />
                  }
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.onMenuClose}
                >
                  {user.name &&
                    <MenuItem disabled divider>Hi, {user.name}!</MenuItem>
                  }
                  <MenuItem onClick={this.onSignOutClick}>Sign Out</MenuItem>
                </Menu>
              </div>
            }
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

function extraProps(props, store) {
  return {
    user: store.getState().user,
    signOut: () => {
      store.signOut();
      return false;
    },
    goBack: () => {
      props.history.goBack();
    }
  };
}

export default withStyles(styles)(storeProvider(extraProps)(Appbar));