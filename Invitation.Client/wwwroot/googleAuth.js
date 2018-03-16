var auth2;

function loadGoogleApi() {
  gapi.load('auth2', function() {
    auth2 = gapi.auth2.init({
      client_id: '488214841032-85h2a7318nf181cu9mrvuh0310muup0u.apps.googleusercontent.com',
      scope: 'profile'
    });
  });
}