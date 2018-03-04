import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import StateApi from '../state-api/src/index';
import axios from 'axios';

axios.get('https://localhost:44381/api/everything')
  .then(resp => {

    const store = new StateApi(resp.data);
    
    ReactDOM.render(
      <App store={store} />,
      document.getElementById('root')
    );
  })
  .catch(error => {
    console.log(error);
  });