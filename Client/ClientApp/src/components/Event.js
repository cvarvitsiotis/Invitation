import React from 'react';
import MessageList from './MessageList';
import EventPersonList from './EventPersonList';
import storeProvider from './storeProvider';

class Event extends React.PureComponent {
  render() {
    const { event, match } = this.props;
    return (
      <div>
        <div className="mb-3">
          <MessageList
            messages={event.messages}
            match={match}
          />
        </div>
        <EventPersonList
          eventId={event.id}
          personStatuses={event.personStatuses}
          match={match}
        />
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    event: store.lookupEvent(props.match.params.id)
  };
}

export default storeProvider(extraProps)(Event);