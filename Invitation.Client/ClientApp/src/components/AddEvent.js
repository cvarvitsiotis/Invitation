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

class AddEvent extends React.PureComponent {
  state = {
    description: '',
    date: ''
  };

  setStateOfDescription = event => {
    this.setState({ description: event.target.value });
  };

  setStateOfDate = event => {
    this.setState({ date: event.target.value });
  };

  onSubmitForm = event => {
    this.props.onSubmitForm(event, this.state.description, this.state.date);
  }

  render() {
    const { classes, onCancel } = this.props;
    return (
      <CardWithStyle>
        <CardContent>
          <form onSubmit={this.onSubmitForm}>
            <TextField
              label="Description"
              value={this.state.description}
              onChange={this.setStateOfDescription}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Date"
              value={this.state.date}
              type="date"
              onChange={this.setStateOfDate}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{
                shrink: true
              }}
            />
            <div className={classes.buttonRow}>
              <Button type="button" onClick={onCancel}>Cancel</Button>
              <Button variant="raised" color="primary" type="submit">Add</Button>
            </div>
          </form>
        </CardContent>
      </CardWithStyle>
    );
  }
}

function extraProps(props, store) {
  return {
    onSubmitForm: (submitEvent, description, date) => {
      submitEvent.preventDefault();
      store.addEvent(description, new Date(date));
      props.history.goBack();
      return false;
    },
    onCancel: () => {
      props.history.goBack();
    }
  };
}

export default withStyles(styles)(storeProvider(extraProps)(AddEvent));