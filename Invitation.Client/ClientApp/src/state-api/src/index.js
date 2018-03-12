import axios from 'axios';
import Authentication from '../../authentication/authentication';

class StateApi {  

  getInitialData = () => ({
    events: {},
    people: {},
    userIsAuthenticated: false,
    userPicture: null
  });
  
  data = this.getInitialData();
  subscriptions = {};  
  lastSubscriptionId = 0;
  authentication = new Authentication();

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

  mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(eventsAndPeople) {
    eventsAndPeople.events.forEach(e => {
      e.messages = this.mapIntoObject(e.messages);
      e.personStatuses = this.mapIntoObject(e.personStatuses);
    });
    eventsAndPeople.events = this.mapIntoObject(eventsAndPeople.events);
    eventsAndPeople.people = this.mapIntoObject(eventsAndPeople.people);
    this.mergeEventAndPeople(eventsAndPeople);
  }

  postAndGetFreshEventAndMerge = (action, data, eventId) => {
    axios.post({
      method: 'post',
      url: `https://localhost:44381/api/${action}`,
      data: data,
      withCredentials: true
    })
      .then(() => {
        return axios({
          method: 'get',
          url: `https://localhost:44381/api/events/${eventId}`,
          withCredentials: true
        });
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
    this.mergeEvent(event);
  };

  mapIntoObject = arr => {
    return arr.reduce((acc, curr) => {
      acc[curr.id] = curr;
      return acc;
    }, {});
  }

  mergeEvent = event => {
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
  
  mergeEventAndPeople = eventsAndPeople => {
    this.data = {
      ...this.data,
      ...eventsAndPeople
    };
    this.notifySubscribers();
  };
  
  addEvent = (description, date) => {
    const addEvent = { description, date: date.toJSON() };
    axios.post({
      method: 'post',
      url: 'https://localhost:44381/api/events',
      data: addEvent,
      withCredentials: true
    })
      .then(resp => {
        this.mapEventPropsIntoObjectsAndMerge(resp.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  mergeUser = (userIsAuthenticated, userPicture) => { 
    this.data.userIsAuthenticated = userIsAuthenticated;
    this.data.userPicture = userPicture;
    this.notifySubscribers();
  };

  clearAllData = () => {
    this.data = this.getInitialData();
    this.notifySubscribers();
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

  getEventsAndPeople = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: 'https://localhost:44381/api/everything',
        withCredentials: true
      });
      this.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(response.data);
    } catch(error) {
      console.log(error);
    }
  };

  signIn = () => {
    this.authentication.signIn()
      .then(result => {
        if (!result.userIsAuthenticated) return;
        this.mergeUser(result.userIsAuthenticated, result.userPicture);
        this.getEventsAndPeople()
          .then(() => {
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  signOut = () => {
    this.authentication.signOut()
      .then(result => {
        if (result) {
          this.clearAllData();
        }
      });
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