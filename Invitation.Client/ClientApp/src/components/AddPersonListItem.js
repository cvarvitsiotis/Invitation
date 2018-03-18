import React from 'react';
import PropTypes from 'prop-types';
import { Route, Link } from 'react-router-dom';
import storeProvider from './storeProvider';

const formatPhone = phone => {
  return `(${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(6)}`;
};

class AddPersonListItem extends React.PureComponent {
  render() {
    const { person, onClick } = this.props;
    return (
      <Route render={({ match, history }) => (
        <Link to="#" className="list-group-item list-group-item-action" onClick={() => onClick(person.id, match.params.id, history)}>
          <div className="d-flex justify-content-between">
            <div>{person.firstName} {person.lastName}</div>
            <div>{formatPhone(person.phone)}</div>
          </div>
        </Link>
      )}/>
    );
  }
}

AddPersonListItem.propTypes = {
  person: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string.isRequired
  })
};

function extraProps(props, store) {
  return {
    onClick: (personId, eventId, history) => {
      store.addPerson(eventId, personId, 'not prompted');
      history.goBack();
      return false;
    }
  };
}

export default storeProvider(extraProps)(AddPersonListItem);