import React from 'react';
import EventList from './EventList';
import Event from './Event';
import NoMatch from './NoMatch';
import AddMessage from './AddMessage';
import AddPersonList from './AddPersonList';
import AddEvent from './AddEvent';
import Login from './Login';
import Appbar from './Appbar';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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
          <Route component={Appbar} />
          <Switch>
            <Route exact path="/" render={props =>
              this.state.user.isSignedIn ? <Redirect to='/events' /> : <Login {...props} />
            }/>
            <PrivateRoute exact path="/events" component={EventList} />
            <PrivateRoute exact path="/events/:id" component={Event} />
            <PrivateRoute path="/events/:id/addPerson" component={AddPersonList} />
            <PrivateRoute path="/events/:id/addMessage" component={AddMessage} />
            <PrivateRoute path="/addEvent" component={AddEvent} />
            <Route component={NoMatch} />
          </Switch>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;