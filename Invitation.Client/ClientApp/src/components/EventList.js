import React from 'react';
import EventListItem from './EventListItem';
import storeProvider from './storeProvider';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardWithStyle from './overrides/CardWithStyle';

const styles = theme => ({
  extraSpacing: {
    marginTop: '70px'
  },
  fab: {
    position: 'fixed',
    bottom: `${70 + theme.spacing(3)}px`, //70px is height of footer
    right: theme.spacing(3)
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
        <Fab color="primary" className={classes.fab} component={Link} to="/addEvent">
          <AddIcon />
        </Fab>
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