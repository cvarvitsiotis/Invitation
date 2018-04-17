import axios from 'axios';
import Authentication from '../../authentication/authentication';
import { apiUrl } from '../../config/config';

class StateApi {  

  constructor() {
    this.data = this.getInitialData();
  }

  getInitialData = () => ({
    events: {},
    people: {},
    user: {
      isSignedIn: false,
      signInError: null,
      name: null,
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
    axios.post(`${apiUrl}/api/${action}`, data, { withCredentials: true })
      .then(() => {
        return axios.get(`${apiUrl}/api/events/${eventId}`, { withCredentials: true });
      })
      .then(result => {
        this.mapEventPropsIntoObjectsAndMerge(result.data);
      })
      .catch(error => {
        alert(`Unable to postAndGetFreshEventAndMerge due to... ${error.message}`);
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

  mergeUser = (isSignedIn, signInError, name, picture) => {
    this.data.user = {
      isSignedIn: isSignedIn,
      signInError: signInError,
      name: name,
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
    axios.post(`${apiUrl}/api/events`, addEvent, { withCredentials: true })
      .then(result => {
        this.mapEventPropsIntoObjectsAndMerge(result.data);
      })
      .catch(error => {
        alert(`Unable to addEvent due to... ${error.message}`);
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
      const result = await axios.get(`${apiUrl}/api/everything`, { withCredentials: true });
      this.mapEventsAndPeopleAndTheirPropsIntoObjectsAndMerge(result.data);
    } catch(error) {
      alert(`Unable to getEventsAndPeople due to... ${error.message}`);
    }
  };

  initializeGoogleApiAndRenderSignInButton = () => {
    this.authentication.loadGoogleApi()
      .then(() => {
        this.authentication.initializeGoogleApiAndRenderSignInButton(this.signIn)
          .then(result => {
            if (result != 'Success') this.mergeUser(false, result, null, null);
          });
      })
      .catch(error => this.mergeUser(false, error.message, null, null));
  }

  signIn = googleUser => {
    this.mergeUser(false, null, null, null);
    this.authentication.signIn(googleUser)
      .then(signInResult => {
        if (!signInResult.isSignedIn) {
          this.authentication.signOutOfGoogle();
          this.mergeUser(false, signInResult.error, null, null);
          return;
        }
        this.mergeUser(true, null, signInResult.name, signInResult.picture);
        this.getEventsAndPeople()
          .then(() => {});
      });
  };

  signOut = () => {
    this.authentication.signOut()
      .then(result => {
        if (result === 'Success') {
          this.clearAllData();
        } else {
          alert(`Unable to sign out due to... ${result}`);
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