import React from 'react';
import storeProvider from './storeProvider';
import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DayJsUtils from '@date-io/dayjs';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/styles';
import CardContent from '@material-ui/core/CardContent';
import CardWithStyle from './overrides/CardWithStyle';

const styles = theme => ({
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(4)
  }
});

class AddEvent extends React.PureComponent {
  state = {
    description: '',
    date: null
  };

  setStateOfDescription = event => {
    this.setState({ description: event.target.value });
  };

  setStateOfDate = date => {
    this.setState({ date: date.toDate() });
  };

  onSubmitForm = event => {
    this.props.onSubmitForm(event, this.state.description, this.state.date);
  }

  render() {
    const { classes, onCancel } = this.props;
    return (
      <MuiPickersUtilsProvider utils={DayJsUtils}>
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
              <DatePicker
                label="Date"
                value={this.state.date}
                onChange={this.setStateOfDate}
                autoOk
                animateYearScrolling
                fullWidth
                margin="normal"
                required
              />
              <div className={classes.buttonRow}>
                <Button type="button" onClick={onCancel}>Cancel</Button>
                <Button variant="contained" color="primary" type="submit">Add</Button>
              </div>
            </form>
          </CardContent>
        </CardWithStyle>
      </MuiPickersUtilsProvider>
    );
  }
}

function extraProps(props, store) {
  return {
    onSubmitForm: (submitEvent, description, date) => {
      submitEvent.preventDefault();
      store.addEvent(description, date);
      props.history.goBack();
      return false;
    },
    onCancel: () => {
      props.history.goBack();
    }
  };
}

export default withStyles(styles)(storeProvider(extraProps)(AddEvent));