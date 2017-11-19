// config/auth.js
var config = 
// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
	    'clientID': '', // your App ID
	    'clientSecret': '', // your App Secret
	    'callbackURL': 'http://127.0.0.1:3000/auth/facebook/callback',
	    'adminProfileId': ''

	}
};