import React from 'react';
import storeProvider from './storeProvider';
import { Route, Link, NavLink } from 'react-router-dom';

class Navbar extends React.PureComponent {
  render() {
    const { user, signOut } = this.props;
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" width="40" height="40" alt="Invitation Logo" />
        </Link>
        <div className="collapse navbar-collapse justify-content-between" id="navbarCollapse">
          <div className="navbar-nav">
            <NavLink to="/events" className="nav-item nav-link" activeClassName="active">Events</NavLink>
            <NavLink to="/people" className="nav-item nav-link" activeClassName="active">People</NavLink>
          </div>
          <div>
            {user.isAuthenticated &&
              <Route render={() => (
                <div className="navbar-nav d-inline-block">
                  <Link to="#" className="nav-item nav-link" onClick={signOut}>Log out</Link>
                </div>
              )}/>
            }
            {user.picture &&
              <img src={user.picture} width="40" height="40" className="rounded d-inline-block align-top" alt="User Picture" />
            }
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
    user: store.getState().user,
    signOut: () => {
      store.signOut();
      return false;
    }
  };
}

export default storeProvider(extraProps)(Navbar);