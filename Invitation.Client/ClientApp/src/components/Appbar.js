import React from 'react';
import storeProvider from './storeProvider';
import { NavLink } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Grid from 'material-ui/Grid';

const AppbarTitle = location => {
  const reViewEvent = /^\/events\/\d+$/;
  const reAddPerson = /^\/events\/\d+\/addPerson$/;
  const reSendMessage = /^\/events\/\d+\/addMessage$/;  
  if (location.pathname === '/events') return 'Events';
  if (reViewEvent.test(location.pathname)) return 'View Event';
  if (reAddPerson.test(location.pathname)) return 'Add Person';
  if (reSendMessage.test(location.pathname)) return 'Send Message';
  if (location.pathname === '/addEvent') return 'New Event';
  return 'Invitation';
};


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

  onLogOutClick = () => {
    this.onMenuClose();
    this.props.signOut();
  };

  render() {
    const { user, location } = this.props;
    const { menuAnchorEl } = this.state;
    const open = Boolean(menuAnchorEl);

    return (
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="title" color="inherit">{AppbarTitle(location)}</Typography>
              <NavLink to="/events">Events</NavLink>
              <NavLink to="/people">People</NavLink>
            </Grid>
            <Grid item>
              {user.name &&
                <Typography variant="body1" color="inherit" align="right">Hi, {user.name}!</Typography>
              }
              {!user.isSignedIn && user.picture &&
                <Avatar src={user.picture} />
              }
              {user.isSignedIn &&
                <div>
                  <IconButton onClick={this.onAvatarClick}>
                    {user.picture &&
                      <Avatar src={user.picture} />
                    }
                    {!user.picture &&
                      <AccountCircle />
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
                    <MenuItem onClick={this.onLogOutClick}>Log Out</MenuItem>
                  </Menu>
                </div>
              }
            </Grid>
          </Grid>
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
    }
  };
}

export default storeProvider(extraProps)(Appbar);