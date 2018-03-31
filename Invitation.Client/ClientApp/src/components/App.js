import React from 'react';
import EventList from './EventList';
import Event from './Event';
import NoMatch from './NoMatch';
import AddMessage from './AddMessage';
import PersonList from './PersonList';
import AddPersonList from './AddPersonList';
import AddEvent from './AddEvent';
import Login from './Login';
import Appbar from './Appbar';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import CssBaseline from 'material-ui/CssBaseline';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
});

class App extends React.Component {
  static childContextTypes = {
    store: PropTypes.object
  };
  getChildContext() {
    return {
      store: this.props.store
    };
  }

  state = this.props.store.getState();

  onStoreChange = () => {
    this.setState(this.props.store.getState());
  }
  componentDidMount() {
    this.subscriptionId = this.props.store.subscribe(this.onStoreChange);
  }
  componentWillUnmount() {
    this.props.store.unsubscribe(this.subscriptionId);
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <CssBaseline />
          <Route component={Appbar} />
          <Grid container justify="center">
            <Grid item xs={8}>
              <Paper className={this.props.classes.root}>
                <Switch>
                  <Route exact path="/" render={props =>
                    this.state.user.isSignedIn ? <Redirect to='/events' /> : <Login {...props} />
                  }/>
                  <PrivateRoute exact path="/events" component={EventList} />
                  <PrivateRoute path="/people" component={PersonList} />
                  <PrivateRoute exact path="/events/:id" component={Event} />
                  <PrivateRoute path="/events/:id/addPerson" component={AddPersonList} />
                  <PrivateRoute path="/events/:id/addMessage" component={AddMessage} />
                  <PrivateRoute path="/addEvent" component={AddEvent} />
                  <Route component={NoMatch} />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);