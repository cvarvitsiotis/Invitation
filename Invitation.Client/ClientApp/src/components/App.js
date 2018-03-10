import React from 'react';
import EventList from './EventList';
import Event from './Event';
import NoMatch from './NoMatch';
import AddMessage from './AddMessage';
import PersonList from './PersonList';
import AddPersonList from './AddPersonList';
import AddEvent from './AddEvent';
import Home from './Home';
import Navbar from './Navbar';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
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
        <div>
          <Route component={Navbar} />
          <main role="main" className="container">
            <Switch>
              <Route exact path="/" component={Home} />
              <PrivateRoute exact path="/events" component={EventList} />
              <PrivateRoute path="/people" component={PersonList} />
              <PrivateRoute exact path="/events/:id" component={Event} />
              <PrivateRoute path="/events/:id/addPerson" component={AddPersonList} />
              <PrivateRoute path="/events/:id/addMessage" component={AddMessage} />
              <PrivateRoute path="/addEvent" component={AddEvent} />
              <Route component={NoMatch} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;