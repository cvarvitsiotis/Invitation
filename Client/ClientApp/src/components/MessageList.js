import React from 'react';
import MessageListItem from './MessageListItem';
import { Link } from 'react-router-dom';

class MessageList extends React.PureComponent {
  render() {
    const { messages, match } = this.props;
    return (
      <div className="card">
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-between">
            <div>Messages</div>
            <Link to={`${match.url}/addMessage`} className="btn btn-outline-primary btn-sm">Add</Link>
          </div>
        </div>
        <div className="list-group list-group-flush">
          {Object.values(messages).map(message =>
            <MessageListItem
              key={message.id}
              message={message}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MessageList;