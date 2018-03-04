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

  post = (action, data) => {
    const url = `http://localhost:5000/api/${action}`;    
    axios.post(url, data)
      .then(resp => {
        return resp.data;
      })
      .catch(error => {
        console.log(error);
      });
  };

  getFreshEvent = eventId => {
    axios.get(`http://localhost:5000/api/events/${eventId}`)
      .then(resp => {
        return resp.data;      
      })
      .catch(error => {
        console.log(error);
      });
  };

  mapEventPropsIntoObjects = event => {
    event.messages = this.mapIntoObject(event.messages);
    event.personStatuses = this.mapIntoObject(event.personStatuses);
    return event;
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
    var event = this.post('event', addEvent);
    event = this.mapEventPropsIntoObjects(event);
    this.mergeEvents(event);
  };

  addMessage = (eventId, content, date) => {
    const addMessage = { content, date: date.toJSON() };
    this.post(`event/${eventId}/messages`, addMessage);
    var event = this.getFreshEvent(eventId);
    event = this.mapEventPropsIntoObjects(event);
    this.mergeEvents(event);
  };

  addPerson = (eventId, personId, status) => {
    const addPersonStatus = { personId, status };
    this.post(`event/${eventId}/personStatuses`, addPersonStatus);
    var event = this.getFreshEvent(eventId);
    event = this.mapEventPropsIntoObjects(event);
    this.mergeEvents(event);
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