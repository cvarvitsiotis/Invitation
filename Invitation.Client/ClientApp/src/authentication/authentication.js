import axios from 'axios';

class Authentication {
  
  signIn = async () => {
    try {
      const externalCredential = await this.signInExternally();
      if (!externalCredential.code) return ({ userIsAuthenticated: false, userPicture: null });
      const internalCredentials = await this.signInInternally(externalCredential.code);
      await this.getAntiForgeryTokens();
      return internalCredentials;
    } catch(error) {
      console.log(error);
      return ({ userIsAuthenticated: false, userPicture: null });
    }
  };

  signInExternally = async () => {
    return await window.auth2.grantOfflineAccess();
  };

  signInInternally = async authCode => {
    const resp = await axios.get(`https://localhost:44381/api/auth/signIn/${encodeURIComponent(authCode)}`);
    return ({ userIsAuthenticated: resp.data.userIsAuthenticated, userPicture: resp.data.userPicture });
  };

  getAntiForgeryTokens = async () => {
    await axios.get('https://localhost:44381/api/auth/getAntiForgeryTokens', { withCredentials: true });
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
    await axios.get('https://localhost:44381/api/auth/signOut', { withCredentials: true });
  };
}

export default Authentication;