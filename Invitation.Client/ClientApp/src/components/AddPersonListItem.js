import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import storeProvider from './storeProvider';
import { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Typography from 'material-ui/Typography';

const formatPhone = phone => {
  return `(${phone.substr(2, 3)}) ${phone.substr(5, 3)}-${phone.substr(8)}`;
};

const formatName = person => {
  var name = '';
  if (person.firstName) name = person.firstName;
  if (person.lastName) name += ` ${person.lastName}`;
  return name.trim();
};

class AddPersonListItem extends React.PureComponent {
  render() {
    const { person, onClick } = this.props;
    return (
      <Route render={({ match, history }) => (
        <ListItem button onClick={() => onClick(person.id, match.params.id, history)}>
          <ListItemText
            primary={formatName(person)}
            secondary={person.phoneType}
          />
          <ListItemSecondaryAction>
            <Typography variant="subheading">{formatPhone(person.phone)}</Typography>
          </ListItemSecondaryAction>
        </ListItem>
      )}/>
    );
  }
}

AddPersonListItem.propTypes = {
  person: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    phoneType: PropTypes.string,
    phone: PropTypes.string.isRequired
  })
};

function extraProps(props, store) {
  return {
    onClick: (personId, eventId, history) => {
      store.addPerson(eventId, personId);
      history.goBack();
      return false;
    }
  };
}

export default storeProvider(extraProps)(AddPersonListItem);