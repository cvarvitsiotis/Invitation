function loadGoogleApi() {
  window.gapi.load('auth2', function() {
    window.gapi.auth2.init({
      client_id: '488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com',
      fetch_basic_profile: false,
      scope: 'profile'
    })
    .then(function() {
      if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        window.gapi.auth2.getAuthInstance().signOut();
      }
    });
  });
}