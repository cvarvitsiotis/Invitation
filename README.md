# Invitation
This app lets you invite your friends to various events via text message, and it keeps track of who RSVP'd. As you send follow-up messages, it automatically excludes those who have declined. It is a web app, so it is not limited to any platform. It is, however, limited to your Google contact list.

## Technical Design

### Primary Technologies
* Client: React SPA
* Server: ASP.NET Core API
* Token service: Google
* Text message service: Twilio

### Authentication
* OIDC implicit auth flow
* Cookie authentication
  * Primary auth cookie implemented with HttpOnly to hide it from XSS.
  * Additional cookie and header token implemented to mitigate CSRF.
  * FYI, primary auth cookie was chosen over JWT token due to later's vulnerability to XSS.
