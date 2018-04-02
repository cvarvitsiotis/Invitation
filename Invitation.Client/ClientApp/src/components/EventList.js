import React from 'react';
import EventListItem from './EventListItem';
import storeProvider from './storeProvider';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import CardWithStyle from './overrides/CardWithStyle';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
});

class EventList extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <CardWithStyle>
        <CardContent>
          {Object.getOwnPropertyNames(this.props.events).length === 0 &&
            <Typography variant="subheading" align="center">Add an Event</Typography>
          }
          {Object.getOwnPropertyNames(this.props.events).length > 0 &&
            <List>
              {Object.values(this.props.events).map(event =>
                <EventListItem
                  key={event.id}
                  event={event}
                  match={this.props.match}
                />
              )}
            </List>
          }
          <Button variant="fab" color="primary" className={classes.fab} component={Link} to="/addEvent">
            <AddIcon />
          </Button>
        </CardContent>
      </CardWithStyle>
    );
  }
}

function extraProps(props, store) {
  return {
    events: store.getState().events
  };
}

export default withStyles(styles)(storeProvider(extraProps)(EventList));