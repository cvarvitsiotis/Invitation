import React from 'react';
import EventList from './EventList';
import Event from './Event';
import NoMatch from './NoMatch';
import AddMessage from './AddMessage';
import AddPersonList from './AddPersonList';
import AddEvent from './AddEvent';
import Signin from './Signin';
import Appbar from './Appbar';
import PrivateRoute from './PrivateRoute';
import Footer from './Footer';
import Privacy from './Privacy';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  appbarAndBody: {
    paddingBottom: theme.spacing.unit * 3
  },
  footer: {
    gridRowStart: 2,
    gridRowEnd: 3
  }
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
    const { classes } = this.props;
    return (
      <BrowserRouter>
        <React.Fragment>
          <div className={classes.appbarAndBody}>
            <Route component={Appbar} />
            <Switch>
              <Route exact path="/" render={props =>
                this.state.user.isSignedIn ? <Redirect to='/events' /> : <Signin {...props} />
              }/>
              <Route exact path="/privacy" component={Privacy} />
              <PrivateRoute exact path="/events" component={EventList} />
              <PrivateRoute exact path="/events/:id" component={Event} />
              <PrivateRoute path="/events/:id/addPerson" component={AddPersonList} />
              <PrivateRoute path="/events/:id/addMessage" component={AddMessage} />
              <PrivateRoute path="/addEvent" component={AddEvent} />
              <Route component={NoMatch} />
            </Switch>
          </div>
          <div className={classes.footer}>
            <Route component={Footer} />
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default withStyles(styles)(App);