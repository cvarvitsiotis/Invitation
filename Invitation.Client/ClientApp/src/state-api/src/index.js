import axios from 'axios';
import Authentication from '../../authentication/authentication';

class StateApi {  

  constructor() {
    this.data = this.getInitialData();
  }

  getInitialData = () => ({
    events: {},
    people: {},
    user: {
      isAuthenticated: false,
      hasAuthorized: false,
      picture: null
    }
  });
  
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
    this.mergeEventsAndPeople(eventsAndPeople);
  }

  postAndGetFreshEventAndMerge = (action, data, eventId) => {
    axios.post(`https://localhost:44381/api/${action}`, data, { withCredentials: true })
      .then(() => {
        return axios.get(`https://localhost:44381/api/events/${eventId}`, { withCredentials: true });
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
  
  mergeEventsAndPeople = eventsAndPeople => {
    this.data = {
      ...this.data,
      ...eventsAndPeople
    };
    this.notifySubscribers();
  };

  mergeUser = (isAuthenticated, hasAuthorized, picture) => {
    this.data.user = {
      isAuthenticated: isAuthenticated,
      hasAuthorized: hasAuthorized,
      picture: picture
    };
    this.notifySubscribers();
  };

  clearAllData = () => {
    this.data = this.getInitialData();
    this.notifySubscribers();
  };

  addEvent = (description, date) => {
    const addEvent = { description, date: date.toJSON() };
    axios.post('https://localhost:44381/api/events', addEvent, { withCredentials: true })
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

  addPerson = (eventId, personId) => {
    const addPersonStatus = { personId, status: 'not prompted' };
    const action = `events/${eventId}/personStatuses`;
    this.postAndGetFreshEventAndMerge(action, addPersonStatus, eventId);
  };

  getEventsAndPeople = async () => {
    try {
      const response = await axios.get('https://localhost:44381/api/everything', { withCredentials: true });
      this.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(response.data);
    } catch(error) {
      console.log(error);
    }
  };

  initializeGoogleApiAndRenderSignInButton = () => {
    this.authentication.initializeGoogleApiAndRenderSignInButton();
  }

  signIn = () => {
    this.authentication.signIn()
      .then(signInResult => {
        if (signInResult.error) {
          alert(signInResult.error);
          return;
        }
        this.mergeUser(true, false, signInResult.userPicture);
        this.authentication.refreshPeople()
          .then(refreshPeopleResult => {
            if (refreshPeopleResult === 'Success') {
              this.mergeUser(true, true, signInResult.userPicture);
              this.getEventsAndPeople().then(() => {});
            } else {
              alert(refreshPeopleResult);             
            }
          });
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