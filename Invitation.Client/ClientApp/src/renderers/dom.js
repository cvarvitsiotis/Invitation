import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import StateApi from '../state-api/src/index';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import '../styles/stickyFooter.css';

const store = new StateApi();

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

const Root = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App store={store} />
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);