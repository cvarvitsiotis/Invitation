import React from 'react';
import MessageList from '../components/MessageList';
import MessageListItem from '../components/MessageListItem';
import StateApi from '../state-api/src/index';
import { data } from '../testData';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import { ThemeProvider } from '@material-ui/styles';

const mountWithRouter = node => mount(<MemoryRouter>{node}</MemoryRouter>);

const theme = createMuiTheme({
  palette: {
    primary: deepPurple
  }
});

const store = new StateApi();
store.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(data);

describe('MessageList', () => {

  const messages = store.getState().events[1].messages;

  it('renders correctly', () => {
    const wrapper = mountWithRouter(
      <ThemeProvider theme={theme}>
        <MessageList
          messages={messages}
          match={{'url': null}}
        />
      </ThemeProvider>
    );

    expect(wrapper.find(MessageListItem).length).toBe(2);
    expect(wrapper.html()).toMatchSnapshot();
  });
});