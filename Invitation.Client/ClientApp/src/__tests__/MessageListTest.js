import React from 'react';
import MessageList from '../components/MessageList';
import MessageListItem from '../components/MessageListItem';
import StateApi from '../state-api/src/index';
import { data } from '../testData';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

const mountWithRouter = node => mount(<MemoryRouter>{node}</MemoryRouter>);

const store = new StateApi();
store.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(data);

describe('MessageList', () => {

  const messages = store.getState().events[1].messages;

  it('renders correctly', () => {
    const wrapper = mountWithRouter(
      <MessageList
        messages={messages}
        match={{'url': null}}
      />
    );

    expect(wrapper.find(MessageListItem).length).toBe(2);
    expect(wrapper.html()).toMatchSnapshot();
  });
});