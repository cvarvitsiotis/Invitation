import React from 'react';
import EventPersonListItem from './EventPersonListItem';
import { Link } from 'react-router-dom';
import { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import PersonAddIcon from 'material-ui-icons/PersonAdd';
import List from 'material-ui/List';
import CardWithStyle from './overrides/CardWithStyle';

class EventPersonList extends React.PureComponent {
  render() {
    const { personStatuses, match } = this.props;
    return (
      <CardWithStyle>
        <CardHeader
          action={
            <Button color="inherit" component={Link} to={`${match.url}/addPerson`}>
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

export default EventPersonList;