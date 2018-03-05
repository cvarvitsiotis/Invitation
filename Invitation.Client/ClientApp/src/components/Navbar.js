import React from 'react';
import storeProvider from './storeProvider';
import { Link, NavLink } from 'react-router-dom';

class Navbar extends React.PureComponent {
  logout = () => {
    this.props.logout(event, this.state.description, this.state.date);
  }

  render() {
    const { isAuthenticated, logout } = this.props;
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" width="40" height="40" alt="" />
        </Link>
        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
          <div className="navbar-nav">
            <NavLink to="/events" className="nav-item nav-link" activeClassName="active">Events</NavLink>
            <NavLink to="/people" className="nav-item nav-link" activeClassName="active">People</NavLink>
          </div>
          <div className="navbar-nav">
            <Link to="#" hidden={isAuthenticated === false} className="nav-item nav-link" onClick={logout}>Log out</Link>
          </div>
        </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
      </nav>
    );
  }
}

function extraProps(props, store) {
  return {
    isAuthenticated: store.getState().isAuthenticated,
    logout: () => {
      store.logout();
      return false;
    }
  };
}

export default storeProvider(extraProps)(Navbar);