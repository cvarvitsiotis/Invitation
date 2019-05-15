# Invitation
This app lets you invite your friends to various events via text message, and it keeps track of who RSVP'd. As you send follow-up messages, it automatically excludes those who have declined. It is a web app, so it is not limited to any platform. It is, however, limited to your Google contacts list.

## Technical Design

### Primary Technologies
* React SPA
* ASP.NET Core API
* Google token service
* Twilio message service

### Authentication
* OAuth 2.0 authorization code flow used to authenticate user and obtain his/her contacts
* Thereafter, the user remains signed-in to the application via cookie
  * Primary auth cookie implemented with HttpOnly to hide it from XSS
  * Additional cookie and header token implemented to mitigate CSRF
  * FYI, primary auth cookie was chosen over JWT token due to later's vulnerability to XSS

### React SPA
* Routing
  * React Router v4
* State
  * Custom state framework built from scratch (rather than Redux)
  * Components subscribe to a central data store via a higher order component (HOC)
  * The HOC connects to the store via React's Context API
  * The HOC is a PureComponent, so it only updates when its props or state change
  * The HOC's state is limited to the state needed by its child component, thus avoiding unnecessary rerenders
  * The child component is a PureComponent, so it doesn't rerender if its props or state haven't actually changed
* Testing
  * Jest & Enzyme
* Syntax
  * ES6 transpiled via Babel
* Build
  * Webpack
  * Separate app and vendor files
* Server side rendering
  * Couldn't get it to work with ASP.NET =(
* Component and style framework
  * Material-UI v4
  * Material-UI Pickers v3
