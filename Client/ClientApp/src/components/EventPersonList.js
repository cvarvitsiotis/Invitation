import React from 'react';
import EventPersonListItem from './EventPersonListItem';
import { Link } from 'react-router-dom';

class EventPersonList extends React.PureComponent {
  render() {
    const { personStatuses, match } = this.props;
    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div>People</div>
            <Link to={`${match.url}/addPerson`} className="btn btn-outline-primary btn-sm">Add</Link>
          </div>
        </div>
        <div className="list-group list-group-flush">
          {Object.values(personStatuses).map(personStatus =>
            <EventPersonListItem
              key={personStatus.id}
              personStatus={personStatus}
            />
          )}
        </div>
      </div>
    );
  }
}

export default EventPersonList;