import axios from 'axios';

class Authentication {
  
  authParams = {
    supportedAuthMethods: [
      'https://accounts.google.com'
    ],
    supportedIdTokenProviders: [
      {
        uri: 'https://accounts.google.com',
        clientId: '488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com'
      }
    ]
  };

  signIn = async () => {
    try {
      const externalCredential = await this.signInExternally();
      if (!externalCredential.idToken) return ({ userIsAuthenticated: false, userPicture: null });
      return await this.signInInternally(externalCredential.idToken);
    } catch(error) {
      console.log(error);
      return ({ userIsAuthenticated: false, userPicture: null });
    }
  };

  signInExternally = async () => { 
    if (!window.googleyolo) return ({ idToken: null });
    try {
      return await window.googleyolo.retrieve(this.authParams);
    } catch(error) {
      try {
        return await window.googleyolo.hint(this.authParams);
      } catch(error) {
        console.log(error);
        return ({ idToken: null });
      }
    }
  };
  
  signInInternally = async idToken => {
    const resp = await axios({
      method: 'get',
      url: `https://localhost:44381/api/auth/signIn/${idToken}`,
      withCredentials: true
    });
    return ({ userIsAuthenticated: resp.data.userIsAuthenticated, userPicture: resp.data.userPicture });
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
    if (!window.googleyolo) return;
    await window.googleyolo.disableAutoSignIn();
  };
  
  signOutInternally = async () => {
    await axios({
      method: 'get',
      url: 'https://localhost:44381/api/auth/signOut',
      withCredentials: true
    });
  };
}

export default Authentication;