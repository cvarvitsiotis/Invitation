import React from 'react';
import PropTypes from 'prop-types';
import storeProvider from './storeProvider';

const getStatusClass = status => {
  switch(status) {
    case 'yes':
      return 'text-success';
    case 'no':
      return 'text-danger';
    case 'no response':
      return 'text-info';
    case 'maybe':
      return 'text-warning';
    case 'not prompted':
      return 'text-secondary';
    default:
      return null;
  }
};

class EventPersonListItem extends React.PureComponent {
  render() {
    const { personStatus, person } = this.props;
    return (
      <div className="list-group-item d-flex justify-content-between">
        <div>{person.firstName} {person.lastName}</div>
        <div>{person.phoneType}</div>
        <div className={getStatusClass(personStatus.status)}>{personStatus.status}</div>
      </div>
    );
  }
}

EventPersonListItem.propTypes = {
  personStatus: PropTypes.shape({
    status: PropTypes.string.isRequired
  }),
  person: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneType: PropTypes.string
  })
};

function extraProps(props, store) {
  return {
    person: store.lookupPerson(props.personStatus.personId)
  };
}

export default storeProvider(extraProps)(EventPersonListItem);