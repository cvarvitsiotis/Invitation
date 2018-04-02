import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from 'material-ui/List';

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