import React from 'react';
import MessageList from './MessageList';
import EventPersonList from './EventPersonList';
import storeProvider from './storeProvider';

class Event extends React.PureComponent {
  render() {
    const { event, match } = this.props;
    return (
      <React.Fragment>
        {Object.getOwnPropertyNames(event.personStatuses).length > 0 && 
          <MessageList
            messages={event.messages}
            match={match}
          />
        }
        <EventPersonList
          eventId={event.id}
          personStatuses={event.personStatuses}
          match={match}
        />
      </React.Fragment>
    );
  }
}

function extraProps(props, store) {
  return {
    event: store.lookupEvent(props.match.params.id)
  };
}

export default storeProvider(extraProps)(Event);