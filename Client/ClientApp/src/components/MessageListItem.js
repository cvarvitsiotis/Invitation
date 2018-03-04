import React from 'react';
import PropTypes from 'prop-types';

const dateDisplay = dateStr => new Date(dateStr).toDateString();

class MessageListItem extends React.PureComponent {
  render() {
    const { message } = this.props;
    return (
      <div  className="list-group-item d-flex justify-content-between">
        <div>{message.content}</div>
        <div>{dateDisplay(message.date)}</div>
      </div>
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