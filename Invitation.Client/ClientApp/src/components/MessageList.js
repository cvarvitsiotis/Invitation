import React from 'react';
import MessageListItem from './MessageListItem';
import { Link } from 'react-router-dom';
import { CardHeader, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import AddCircleIcon from 'material-ui-icons/AddCircle';
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

class MessageList extends React.PureComponent {
  render() {
    const { messages, match, classes } = this.props;
    return (
      <CardWithStyle>
        <CardHeader
          action={
            <Button className={classes.button} component={Link} to={`${match.url}/addMessage`}>
              <AddCircleIcon />
            </Button>
          }
          title="Messages"
        />
        <CardContent>
          <List>
            {Object.values(messages).map(message =>
              <MessageListItem
                key={message.id}
                message={message}
              />
            )}
          </List>
        </CardContent>
      </CardWithStyle>
    );
  }
}

export default withStyles(styles)(MessageList);