window.onGoogleYoloLoad = function(googleyolo) {
  googleyoloRetrieve();
}

function googleyoloRetrieve() {
  const retrieveParams = {
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

  window.googleyolo.retrieve(retrieveParams)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
      googleyoloHint();      
    });
};

function googleyoloHint() {
  const hintParams = {
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

  window.googleyolo.hint(hintParams)
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.log(error);
    });
}

function googleyoloCancelLastOperation() {
  window.googleyolo.cancelLastOperation().then(() => {
    // Credential selector closed.
  });
}

function googleyoloDisableAutoSignIn() {
  window.googleyolo.disableAutoSignIn().then(() => {
    // Auto sign-in disabled.
  });
}