import axios from 'axios';

class StateApi {
  
  constructor(rawData) {
    this.data = this.convertRawData(rawData);
    this.subscriptions = {};
    this.lastSubscriptionId = 0;
  }

  convertRawData(rawData) {
    rawData.events.forEach(e => {
      e.messages = this.mapIntoObject(e.messages);
      e.personStatuses = this.mapIntoObject(e.personStatuses);
    });
    return {
      events: this.mapIntoObject(rawData.events),
      people: this.mapIntoObject(rawData.people)
    };
  }

  mapIntoObject = arr => {
    return arr.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  getState = () => {
    return this.data;
  };

  lookupPerson = personId => {
    return this.data.people[personId];
  };

  lookupEvent = eventId => {
    return this.data.events[eventId];
  };

  lookupPeopleNotInEvent = eventId => {
    var event = this.lookupEvent(eventId);
    const currentPeople = Object.values(event.personStatuses);
    const allPeople = Object.values(this.data.people);
    return allPeople.filter(a => currentPeople.findIndex(c => c.personId === a.id) === -1);
  };

  postAndGetFreshEventAndMerge = (action, data, eventId) => {
    const url = `https://localhost:44381/api/${action}`;
    axios.post(url, data)
      .then(() => {
        return axios.get(`https://localhost:44381/api/events/${eventId}`);
      })
      .then(resp => {
        this.mapEventPropsIntoObjectsAndMerge(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  mapEventPropsIntoObjectsAndMerge = event => {
    event.messages = this.mapIntoObject(event.messages);
    event.personStatuses = this.mapIntoObject(event.personStatuses);
    this.mergeEvents(event);
  };

  mergeEvents = event => {
    //React's shallow comparison will not detect a change in the state when mearly reassigning a property (e.g. messages, personStatuses) of an event.
    //This is because they are properties of a property (an event) of a property (events) of the state object.
    //Shallow comparisons will only detect changes of the events property (I think).
    //So, we need to have events point to a new object.
    this.data = {
      ...this.data,
      events: {
        ...this.data.events,
        [event.id]: event
      }
    };
    this.notifySubscribers();
  };

  addEvent = (description, date) => {
    const addEvent = { description, date: date.toJSON() };
    const action = 'events';
    const data = addEvent;
    const url = `https://localhost:44381/api/${action}`;    
    axios.post(url, data)
      .then(resp => {
        this.mapEventPropsIntoObjectsAndMerge(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  addMessage = (eventId, content, date) => {
    const addMessage = { content, date: date.toJSON() };
    const action = `events/${eventId}/messages`;
    this.postAndGetFreshEventAndMerge(action, addMessage, eventId);
  };

  addPerson = (eventId, personId, status) => {
    const addPersonStatus = { personId, status };
    const action = `events/${eventId}/personStatuses`;
    this.postAndGetFreshEventAndMerge(action, addPersonStatus, eventId);
  };

  subscribe = callback => {
    this.lastSubscriptionId++;
    this.subscriptions[this.lastSubscriptionId] = callback;
    return this.lastSubscriptionId;
  };

  unsubscribe = subscriptionId => {
    delete this.subscriptions[subscriptionId];
  };

  notifySubscribers = () => {
    Object.values(this.subscriptions).forEach(callback => callback());
  };
}

export default StateApi;