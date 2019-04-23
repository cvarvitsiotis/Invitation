import React from 'react';
import PropTypes from 'prop-types';
import storeProvider from './storeProvider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import orange from '@material-ui/core/colors/orange';
import blueGrey from '@material-ui/core/colors/blueGrey';
import blue from '@material-ui/core/colors/blue';
import CheckIcon from '@material-ui/icons/Check';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

const greenColor = green[500];
const redColor = red[500];

const getStatus = (status, classes) => {
  switch(status) {
    case 'yes':
      return (
        <CheckIcon nativeColor={greenColor} />
      );
    case 'no':
      return (
        <NotInterestedIcon nativeColor={redColor} />
      );
    default:
      return (
        <Typography variant="subtitle1" className={primaryColor(status, classes)}>{status}</Typography>
      );
  }
};

const styles = () => ({
  greenPrimary: {
    color: greenColor
  },
  greenSecondary: {
    color: green[300]
  },
  redPrimary: {
    color: redColor
  },
  redSecondary: {
    color: red[300]
  },
  orangePrimary: {
    color: orange[500]
  },
  orangeSecondary: {
    color: orange[300]
  },
  bluePrimary: {
    color: blue[500]
  },
  blueSecondary: {
    color: blue[300]
  },
  greyPrimary: {
    color: blueGrey[500]
  },
  greySecondary: {
    color: blueGrey[300]
  }
});

const primaryColor = (status, classes) => {
  switch(status) {
    case 'yes':
      return classes.greenPrimary;
    case 'no':
      return classes.redPrimary;
    case 'maybe':
      return classes.orangePrimary;
    case 'no response':
      return classes.bluePrimary;
    case 'not prompted':
      return classes.greyPrimary;
    default:
      return null;
  }
};

const secondaryColor = (status, classes) => {
  switch(status) {
    case 'yes':
      return classes.greenSecondary;
    case 'no':
      return classes.redSecondary;
    case 'maybe':
      return classes.orangeSecondary;
    case 'no response':
      return classes.blueSecondary;
    case 'not prompted':
      return classes.greySecondary;
    default:
      return null;
  }
};

class EventPersonListItem extends React.PureComponent {
  render() {
    const { personStatus, person, classes } = this.props;
    return (
      <ListItem>
        <ListItemText
          disableTypography
          primary={<Typography variant="subtitle1" className={primaryColor(personStatus.status, classes)}>{person.firstName} {person.lastName}</Typography>}
          secondary={<Typography variant="body2" className={secondaryColor(personStatus.status, classes)}>{person.phoneType}</Typography>}
        />
        <ListItemSecondaryAction>
          {getStatus(personStatus.status, classes)}
        </ListItemSecondaryAction>
      </ListItem>
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

export default withStyles(styles)(storeProvider(extraProps)(EventPersonListItem));