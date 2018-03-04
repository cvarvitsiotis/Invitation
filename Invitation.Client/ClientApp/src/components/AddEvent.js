import React from 'react';
import storeProvider from './storeProvider';

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
    return (
      <div>
        <form onSubmit={this.onSubmitForm}>
          <div className="form-group">
            <input
              value={this.state.description}
              onChange={this.setStateOfDescription}
              className="form-control" placeholder="Description" required></input>
          </div>
          <div className="form-group">
            <input
              value={this.state.date}
              onChange={this.setStateOfDate}
              className="form-control" placeholder="Date" required></input>
          </div>
          <button type="submit" className="btn btn-outline-primary">Add</button>
        </form>
      </div>
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
    }
  };
}

export default storeProvider(extraProps)(AddEvent);