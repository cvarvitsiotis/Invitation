import React from 'react';
import AddPersonListItem from './AddPersonListItem';
import storeProvider from './storeProvider';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import CardWithStyle from './overrides/CardWithStyle';

class AddPersonList extends React.PureComponent {
  render() {
    const { people } = this.props;
    return (
      <CardWithStyle>
        <CardContent>
          <List>
            {Object.values(people).map(person =>
              <AddPersonListItem
                key={person.id}
                person={person}
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
    people: store.lookupPeopleNotInEvent(props.match.params.id)
  };
}

export default storeProvider(extraProps)(AddPersonList);