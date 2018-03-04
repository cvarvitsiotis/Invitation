import React from 'react';
import EventListItem from './EventListItem';
import storeProvider from './storeProvider';
import { Link } from 'react-router-dom';

class EventList extends React.PureComponent {
  render() {
    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div>Events</div>
            <Link to="/addEvent" className="btn btn-outline-primary btn-sm">Add</Link>
          </div>
        </div>
        <div className="list-group list-group-flush">
          {Object.values(this.props.events).map(event =>
            <EventListItem
              key={event.id}
              event={event}
              match={this.props.match}
            />
          )}
        </div>
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    events: store.getState().events
  };
}

export default storeProvider(extraProps)(EventList);