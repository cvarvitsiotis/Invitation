import React from 'react';
import EventPersonListItem from './EventPersonListItem';
import { Link } from 'react-router-dom';
import { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import List from 'material-ui/List';
import CardWithStyle from './overrides/CardWithStyle';
import { withStyles } from 'material-ui/styles';
import deepPurple from 'material-ui/colors/deepPurple';

const styles = () => ({
  button: {
    color: deepPurple[400],
    '&:hover': {
      color: deepPurple[700]
    }
  }
});

class EventPersonList extends React.PureComponent {
  render() {
    const { personStatuses, match, classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader
          action={
            <Button className={classes.button} component={Link} to={`${match.url}/addPerson`}>
              <PersonAddIcon />
            </Button>
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

export default withStyles(styles)(EventPersonList);