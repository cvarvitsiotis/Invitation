import axios from 'axios';
import { apiUrl } from '../config/config';

class Authentication {

  loadGoogleApi = () => {    
    var timesCheckedIfGoogleApiIsLoaded = 0;
    return new Promise((resolve, reject) => {
      var loadGoogleApiInterval = setInterval(() => {
        if (++timesCheckedIfGoogleApiIsLoaded > 100) {
          clearInterval(loadGoogleApiInterval);
          reject('Unable to load Google API');
        }
        if (!this.isGoogleApiLoaded()) return;
        clearInterval(loadGoogleApiInterval);
        resolve('Success');
      }, 250);
    });
  };

  isGoogleApiLoaded = () => {
    return window.gapi && window.gapi.auth2;
  };

  initializeGoogleApiAndRenderSignInButton = async signInCallback => {
    try {
      if (!this.isGoogleApiInitialized()) {
        await this.initializeGoogleApi();
        if (!this.isGoogleApiInitialized()) return 'Unable to initialize Google API';
      }
      await this.signOutOfGoogleIfSignedIn();
      this.renderSigninButton(signInCallback);
    } catch(error) {
      return error.message;
    }
  };

  initializeGoogleApi = async () => {
    await window.gapi.auth2.init({
      client_id: '488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com',
      scope: 'profile https://www.googleapis.com/auth/contacts.readonly'
    });
  };

  isGoogleApiInitialized = () => {
    return window.gapi.auth2.getAuthInstance();
  };

  signOutOfGoogleIfSignedIn = async () => {
    if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      await this.signOutOfGoogle();
    }
  };

  renderSigninButton = signInCallback => {
    window.gapi.signin2.render('googleSigninButton', {
      'theme': 'dark'
    });
    window.gapi.auth2.getAuthInstance().attachClickHandler('googleSigninButton', {}, signInCallback, null);
  };

  signIn = async googleUser => {
    try {
      const profile = googleUser.getBasicProfile();
      const name = profile.getGivenName();
      const picture = profile.getImageUrl();
      const accessToken = googleUser.getAuthResponse().access_token;
      if (!accessToken) return ({ isSignedIn: false, error: 'Unable to obtain Google access token' });
      await this.signInInternally(accessToken);
      await this.getAntiForgeryTokens();
      return { isSignedIn: true, name, picture };
    } catch(error) {
      return { isSignedIn: false, error: error.message };
    }
  };

  signInInternally = async accessToken => {
    await axios.get(`${apiUrl}/api/auth/signIn/${encodeURIComponent(accessToken)}`, { withCredentials: true });
  };

  getAntiForgeryTokens = async () => {
    const result = await axios.get(`${apiUrl}/api/auth/getAntiForgeryTokens`, { withCredentials: true });
    //Cookie name must match axios's xsrfCookieName
    document.cookie = `XSRF-TOKEN=${encodeURIComponent(result.data)}`;
  };

  signOut = async () => {
    try {
      await this.signOutOfGoogle();
      await this.signOutInternally();
      return 'Success';
    } catch(error) {
      return error.message;
    }
  };

  signOutOfGoogle = async () => {
    await window.gapi.auth2.getAuthInstance().signOut();
  };
  
  signOutInternally = async () => {
    await axios.get(`${apiUrl}/api/auth/signOut`, { withCredentials: true });
  };
}

export default Authentication;