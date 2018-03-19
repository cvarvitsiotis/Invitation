import StateApi from '../state-api/src/index';
import { data } from '../testData';

const store = new StateApi();
store.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(data);

describe('StateApi', () => {
  
  it('exposes events as an object', () => {
    const events = store.getState().events;
    const eventId = data.events['1'].id;
    const eventDescription = data.events['1'].description;

    expect(events).toHaveProperty(eventId);
    expect(events[eventId].description).toBe(eventDescription);
  });

  it('exposes people as an object', () => {
    const people = store.getState().people;
    const personId = data.people['1'].id;
    const personFirstName = data.people['1'].firstName;

    expect(people).toHaveProperty(personId);
    expect(people[personId].firstName).toBe(personFirstName);
  });

});