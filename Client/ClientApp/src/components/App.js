import React from 'react';
import EventList from './EventList';
import Event from './Event';
import NoMatch from './NoMatch';
import AddMessage from './AddMessage';
import PersonList from './PersonList';
import AddPersonList from './AddPersonList';
import AddEvent from './AddEvent';
import Home from './Home';
import { BrowserRouter, Route, Link, NavLink, Switch } from 'react-router-dom';
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
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
            <Link to="/" className="navbar-brand">
              <img src="/logo.png" width="40" height="40" alt="" />
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <NavLink to="/events" className="nav-link" activeClassName="active">Events</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/people" className="nav-link" activeClassName="active">People</NavLink>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="container">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path="/events" component={EventList} />
              <Route path="/people" component={PersonList} />
              <Route exact path="/events/:id" component={Event} />
              <Route path="/events/:id/addPerson" component={AddPersonList} />
              <Route path="/events/:id/addMessage" component={AddMessage} />
              <Route path="/addEvent" component={AddEvent} />
              <Route component={NoMatch} />
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;