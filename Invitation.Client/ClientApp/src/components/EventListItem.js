import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const dateDisplay = dateStr => new Date(dateStr).toDateString();

class EventListItem extends React.PureComponent {
  render() {
    const { event, match } = this.props;
    return (
      <ListItem button component={Link} to={`${match.url}/${event.id}`}>
        <ListItemText
          primary={event.description}
          secondary={dateDisplay(event.date)}
        />
      </ListItem>
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