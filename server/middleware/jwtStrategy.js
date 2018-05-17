const { ExtractJwt } = require("passport-jwt");
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../users/userModel");

const secret = "that is what I shared yesterday lol";

const jwtOptions = {
	secretOrKey: secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtStrategy = new JwtStrategy(jwtOptions, function(payload, done) {
	// find user by id
	User.findById(payload.sub)
		.then(user => {
			if (user) {
				done(null, user); // return user
			} else {
				done(null, false);
			}
		})
		.catch(err => {
			done(err);
		});
});

module.exports = jwtStrategy;
