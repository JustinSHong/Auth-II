const jwt = require("jsonwebtoken");
const secret = "that is what I shared yesterday lol";

// helper function
const makeToken = function(user) {
	const timestamp = new Date().getTime();
	const payload = {
		sub: user._id, // subject - who the token refers to
		iat: timestamp, // issued at - when token is made
		username: user.username // name of user stored in token
	};
	const options = {
		expiresIn: "24h"
	};
	return jwt.sign(payload, secret, options);
};

module.exports = makeToken;
