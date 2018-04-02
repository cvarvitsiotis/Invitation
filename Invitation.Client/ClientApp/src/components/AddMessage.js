import React from 'react';
import storeProvider from './storeProvider';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { withStyles } from 'material-ui/styles';
import { CardContent } from 'material-ui/Card';
import CardWithStyle from './overrides/CardWithStyle';

const styles = theme => ({
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing.unit * 4
  }
});

class AddMessage extends React.PureComponent {
  state = {
    message: ''
  };
  
  setStateOfMessage = event => {
    this.setState({ message: event.target.value });
  };

  onSubmitForm = event => {
    this.props.onSubmitForm(event, this.state.message);
  }

  render() {
    const { classes, onCancel } = this.props;    
    return (
      <CardWithStyle>
        <CardContent>
          <form onSubmit={this.onSubmitForm}>
            <TextField
              label="Message"
              value={this.state.message}
              onChange={this.setStateOfMessage}
              multiline
              rows="5"
              fullWidth
              margin="normal"
              required
            />
            <div className={classes.buttonRow}>
              <Button type="button" onClick={onCancel}>Cancel</Button>
              <Button variant="raised" color="primary" type="submit">Send</Button>
            </div>
          </form>
        </CardContent>
      </CardWithStyle>
    );
  }
}

function extraProps(props, store) {
  return {
    onSubmitForm: (submitEvent, message) => {
      submitEvent.preventDefault();
      store.addMessage(props.match.params.id, message, new Date());
      props.history.goBack();
      return false;
    },
    onCancel: () => {
      props.history.goBack();
    }
  };
}

export default withStyles(styles)(storeProvider(extraProps)(AddMessage));