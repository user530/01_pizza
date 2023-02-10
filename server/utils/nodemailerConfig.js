// Import google api
const { google } = require("googleapis");

// OAuth client
const myOAuth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URL
);

// Set refresh token
myOAuth2Client.setCredentials({
  refresh_token: process.env.OAUTH_REFRESH_TOKEN,
});

module.exports = {
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: myOAuth2Client._clientId,
    clientSecret: myOAuth2Client._clientSecret,
    refreshToken: myOAuth2Client.credentials.refresh_token,
    accessToken: myOAuth2Client.getAccessToken(),
  },
  // For testing purposes
  // debugger: true,
  // logger: true,
};
