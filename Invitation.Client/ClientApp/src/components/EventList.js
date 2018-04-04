import React from 'react';
import EventListItem from './EventListItem';
import storeProvider from './storeProvider';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
import { CardContent, CardHeader } from 'material-ui/Card';
import CardWithStyle from './overrides/CardWithStyle';

const styles = theme => ({
  extraSpacing: {
    marginTop: '10vh'
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 10,
    right: theme.spacing.unit * 2,
  }
});

class EventList extends React.PureComponent {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CardWithStyle>
          {Object.getOwnPropertyNames(this.props.events).length === 0 &&
            <CardHeader align="center" title="Add an Event" />
          }
          <CardContent>
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
            {!Object.getOwnPropertyNames(this.props.events).length > 0 &&
              <div className={classes.extraSpacing}>
              </div>
            }
          </CardContent>
        </CardWithStyle>
        <Button variant="fab" color="primary" className={classes.fab} component={Link} to="/addEvent">
          <AddIcon />
        </Button>
      </React.Fragment>
    );
  }
}

function extraProps(props, store) {
  return {
    events: store.getState().events
  };
}

export default withStyles(styles)(storeProvider(extraProps)(EventList));