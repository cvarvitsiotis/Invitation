import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const dateDisplay = dateStr => new Date(dateStr).toDateString();

class MessageListItem extends React.PureComponent {
  render() {
    const { message } = this.props;
    return (
      <ListItem>
        <ListItemText
          primary={message.content}
          secondary={dateDisplay(message.date)}
        />
      </ListItem>
    );
  }
}

MessageListItem.propTypes = {
  message: PropTypes.shape({
    content: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired
  })
};

export default MessageListItem;