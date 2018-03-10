import React from 'react';
import { Link } from 'react-router-dom';

class NoMatch extends React.PureComponent {
  render() {
    return (
      <div className="text-center">
        <h3 className="text-danger font-weight-light">No Match</h3>
        <h4>Shall we head <Link to="/">Home</Link>?</h4>
      </div>
    );
  }
}

export default NoMatch;