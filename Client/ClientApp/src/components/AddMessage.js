import React from 'react';
import storeProvider from './storeProvider';

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
    return (
      <div>
        <form onSubmit={this.onSubmitForm}>
          <div className="form-group">
            <textarea
              value={this.state.message}
              onChange={this.setStateOfMessage}
              className="form-control" rows="4" placeholder="Enter message" required></textarea>
          </div>
          <button type="submit" className="btn btn-outline-primary">Send</button>
        </form>
      </div>
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
    }
  };
}

export default storeProvider(extraProps)(AddMessage);