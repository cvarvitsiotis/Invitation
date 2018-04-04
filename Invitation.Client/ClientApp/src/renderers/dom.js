import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import StateApi from '../state-api/src/index';
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import deepPurple from 'material-ui/colors/deepPurple';
import '../styles/stickyFooter.css';

const store = new StateApi();

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

const Root = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App store={store} />
    </MuiThemeProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);