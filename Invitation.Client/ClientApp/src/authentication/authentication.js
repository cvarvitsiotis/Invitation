import axios from 'axios';

class Authentication {
  
  initializeGoogleApiAndRenderSignInButton =  () => {    
    var timesCheckedIfGoogleApiIsReady = 0;
    var googleApiIsReadyInterval = setInterval(() => {
      if (++timesCheckedIfGoogleApiIsReady > 100) {
        clearInterval(googleApiIsReadyInterval);
        console.log('Google API never became ready.');
      }
      if (!this.isGoogleApiReady()) return;
      clearInterval(googleApiIsReadyInterval);
      this.initializeGoogleApiAndRenderSignInButtonInternal();
    }, 250);
  };

  isGoogleApiReady = () => {
    return window.gapi && window.gapi.auth2;
  };

  initializeGoogleApiAndRenderSignInButtonInternal = () => {
    this.initializeGoogleApi()
      .then(() => {
        this.signOutOfGoogleIfSignedIn()
          .then(() => {
            this.renderSignInButton();
          });
      });
  };

  initializeGoogleApi = async () => {
    await window.gapi.auth2.init({
      client_id: '488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com',
      fetch_basic_profile: false,
      scope: 'profile'
    });
  };

  signOutOfGoogleIfSignedIn = async () => {
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await window.gapi.auth2.getAuthInstance().signOut();
    }
  };

  renderSignInButton = () => {
    window.gapi.signin2.render('googleSigninButton');
  };

  signIn = async () => {
    try {
      const idToken = await this.signInExternally();
      if (!idToken) return ({ error: 'External signin failed', userPicture: null });

      const internalSignInResponse = await this.signInInternally(idToken);
      if (!internalSignInResponse.userIsAuthenticated) return ({ error: 'Internal signin failed', userPicture: null });

      await this.getAntiForgeryTokens();
    } catch(error) {
      console.log(error);
      return ({ error: error, userPicture: null });
    }
  };

  signInExternally = async () => {
    const user = await window.gapi.auth2.getAuthInstance().signIn();
    return user.getAuthResponse(false).id_token;
  };

  signInInternally = async idToken => {
    const resp = await axios.get(`https://localhost:44381/api/auth/signIn/${encodeURIComponent(idToken)}`, { withCredentials: true });
    return ({ userIsAuthenticated: resp.data.userIsAuthenticated, userPicture: resp.data.userPicture });
  };

  getAntiForgeryTokens = async () => {
    await axios.get('https://localhost:44381/api/auth/getAntiForgeryTokens', { withCredentials: true });
  };

  refreshPeople = async () => {
    try {
      const wasPreviouslyAuthorized = await this.wasPreviouslyAuthorized();
      if (!wasPreviouslyAuthorized) {
        const authorizationResult = await this.authorize();
        if (authorizationResult != 'Success') return authorizationResult;
      }
      await this.refreshPeopleInternal();
      return 'Success';
    } catch(error) {
      return error;
    }
  };

  wasPreviouslyAuthorized = async () => {
    const resp = await axios.get('https://localhost:44381/api/auth/wasPreviouslyAuthorized', { withCredentials: true });
    return resp.data;
  };

  authorize = async () => {
    const authCode = await this.requestAuthorization();
    if (!authCode) return 'Unable to obtain auth code';
    const wasExchanged = await this.exchangeAuthCodeForAccessToken(authCode);
    return wasExchanged ? 'Success' : 'Unable to exchange auth code for access token';
  };

  requestAuthorization = async () => {
    const user = await window.gapi.auth2.getAuthInstance().currentUser.get().grant({
      'scope': 'https://www.googleapis.com/auth/contacts.readonly'
    });
    return user.getAuthResponse(true).code;
  };

  exchangeAuthCodeForAccessToken = async authCode => {
    const resp = await axios.get(`https://localhost:44381/api/auth/exchangeAuthCodeForAccessToken/${encodeURIComponent(authCode)}`, { withCredentials: true });
    return resp.data;
  };
  
  refreshPeopleInternal = async () => {
    const resp = await axios.get('https://localhost:44381/api/auth/refreshPeople', { withCredentials: true });
    return resp.data;
  };

  signOut = async () => {
    try {
      await this.signOutExternally();
      await this.signOutInternally();
      return true;
    } catch(error) {
      console.log(error);
      return false;
    }
  };

  signOutExternally = async () => {
    await window.gapi.auth2.getAuthInstance().signOut();
  };
  
  signOutInternally = async () => {
    await axios.get('https://localhost:44381/api/auth/signOut', { withCredentials: true });
  };
}

export default Authentication;