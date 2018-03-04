import React from 'react';
import AddPersonListItem from './AddPersonListItem';
import storeProvider from './storeProvider';

class AddPersonList extends React.PureComponent {
  render() {
    const { people } = this.props;
    return (
      <div className="card">
        <div className="card-header">Select Person</div>
        <div className="list-group list-group-flush">
          {Object.values(people).map(person =>
            <AddPersonListItem
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
    people: store.lookupPeopleNotInEvent(props.match.params.id)
  };
}

export default storeProvider(extraProps)(AddPersonList);