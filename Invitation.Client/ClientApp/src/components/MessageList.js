import React from 'react';
import MessageListItem from './MessageListItem';
import { Link } from 'react-router-dom';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import MessageIcon from '@material-ui/icons/Message';
import List from '@material-ui/core/List';
import CardWithStyle from './overrides/CardWithStyle';
import { withStyles } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';

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
              <MessageIcon />
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