import React from 'react';
import PropTypes from 'prop-types';

const formatPhone = phone => {
  return `(${phone.substr(0, 3)}) ${phone.substr(3, 3)}-${phone.substr(6)}`;
};

class PersonListItem extends React.PureComponent {
  render() {
    const { person } = this.props;
    return (
      <div className="list-group-item d-flex justify-content-between">
        <div>{person.firstName} {person.lastName}</div>
        <div>{formatPhone(person.phone)}</div>
      </div>
    );
  }
}

PersonListItem.propTypes = {
  person: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired
  })
};

export default PersonListItem;