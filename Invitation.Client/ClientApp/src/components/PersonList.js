import React from 'react';
import PersonListItem from './PersonListItem';
import storeProvider from './storeProvider';

class PersonList extends React.PureComponent {
  render() {
    return (
      <div className="card">
        <div className="card-header">People</div>
        <div className="list-group list-group-flush">
          {Object.values(this.props.people).map(person =>
            <PersonListItem
              key={person.id}
              person={person}
            />
          )}
        </div>
      </div>
    );
  }
}

function extraProps(props, store) {
  return {
    people: store.getState().people
  };
}

export default storeProvider(extraProps)(PersonList);