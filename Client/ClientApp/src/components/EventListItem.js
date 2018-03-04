import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const dateDisplay = dateStr => new Date(dateStr).toDateString();

class EventListItem extends React.PureComponent {
  render() {
    const { event, match } = this.props;
    return (
      <Link to={`${match.url}/${event.id}`} className="list-group-item list-group-item-action">
        <div className="d-flex justify-content-between">
          <div>{event.description}</div>
          <div>{dateDisplay(event.date)}</div>
        </div>
      </Link>
    );
  }
}

EventListItem.propTypes = {
  event: PropTypes.shape({
    description: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  })
};

export default EventListItem;