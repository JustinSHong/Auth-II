const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("../users/userModel");

// define local strategy
const localStrategy = new LocalStrategy(function(username, password, done) {
	// validate user with validatePassword()
	User.find(username)
		.then(user => {
			// validate user
			if (!user) {
				done(null, false);
			} else {
				// pass relevant data via req.user
				user.validatePassword(password).then(isValid => {
					// passwords match
					if (isValid) {
						const { _id, username } = user;
						return done(null, { _id, username });
					} else {
						// passwords do not match
						return done(null, false);
					}
				});
			}
		})
		.catch(err => {
			return done(err);
		});
});

module.exports = localStrategy;
