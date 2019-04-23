import React from 'react';
import EventPersonListItem from './EventPersonListItem';
import storeProvider from './storeProvider';
import { Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import RefreshIcon from '@material-ui/icons/Refresh';
import List from '@material-ui/core/List';
import CardWithStyle from './overrides/CardWithStyle';
import { withStyles } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import blueGrey from '@material-ui/core/colors/blueGrey';

const styles = () => ({
  personAddButton: {
    color: deepPurple[400],
    '&:hover': {
      color: deepPurple[700]
    }
  },
  refreshButton: {
    color: blueGrey[400],
    '&:hover': {
      color: blueGrey[700]
    }
  }
});

class EventPersonList extends React.PureComponent {
  render() {
    const { personStatuses, refreshEvent, match, classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader
          action={
            <React.Fragment>
              <Button className={classes.refreshButton} onClick={refreshEvent}>
                <RefreshIcon />
              </Button>
              <Button className={classes.personAddButton} component={Link} to={`${match.url}/addPerson`}>
                <PersonAddIcon />
              </Button>
            </React.Fragment>
          }
          title="People"
        />
        <CardContent>
          <List>
            {Object.values(personStatuses).map(personStatus =>
              <EventPersonListItem
                key={personStatus.id}
                personStatus={personStatus}
              />
            )}
          </List>
        </CardContent>
      </CardWithStyle>
    );
  }
}

function extraProps(props, store) {
  return {
    refreshEvent: () => {
      store.refreshEvent(props.eventId);
    }
  };
}

export default withStyles(styles)(storeProvider(extraProps)(EventPersonList));