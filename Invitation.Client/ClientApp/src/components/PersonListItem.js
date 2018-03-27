import React from 'react';
import PropTypes from 'prop-types';

const formatPhone = phone => {
  return `(${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8)}`;
};

class PersonListItem extends React.PureComponent {
  render() {
    const { person } = this.props;
    return (
      <div className="list-group-item d-flex justify-content-between">
        <div>{person.firstName} {person.lastName}</div>
        <div>{person.phoneType}</div>        
        <div>{formatPhone(person.phone)}</div>
      </div>
    );
  }
}

PersonListItem.propTypes = {
  person: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneType: PropTypes.string,
    phone: PropTypes.string.isRequired
  })
};

export default PersonListItem;