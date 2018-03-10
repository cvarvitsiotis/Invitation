import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import StateApi from '../state-api/src/index';

const store = new StateApi();

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);