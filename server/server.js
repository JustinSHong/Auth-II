const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
// global middleware that will require login on restricted pages
// const authenticate = require("./middleware/authenticate");
const validateLogin = require("./middleware/login");

// connect to mongodb
mongoose
	.connect("mongodb://localhost/jwtauth")
	.then(connection => {
		console.log("\n===connected to jwtauth Database===\n");
	})
	.catch(err => {
		console.log("error connecting to mongo", err);
	});

// sub-applications
const Register = require("./register/Register");
const Login = require("./login/Login");
const Users = require("./users/User");
const Logout = require("./logout/Logout");

const server = express();

// middleware
server.use(express.json());
server.use(helmet());
// express-session configuration
server.use(
	session({
		secret: "M2346eZhJM3Np1v8vTZdJRImHSkIIyf2kbIM5h+VuABXaFJAX96KyXKxX8pU+h8F",
		cookie: {
			maxAge: 1 * 24 * 60 * 60 * 1000
		},
		httpOnly: true,
		secure: false,
		resave: true,
		saveUninitialized: false,
		resave: false,
		name: "noname",
		store: new MongoStore({
			url: "mongodb://localhost/sessions",
			ttl: 60 * 10
		})
	})
);

// passport global middleware
passport.use(validateLogin);
// passport.use(jwtStrategy);

// passport local middleware
const passportOptions = {
	session: false
};
const authenticate = passport.authenticate("local", passportOptions); // invokes req.login()
// const protected = passport.authenticate("jswt", passportOptions);

// routes
server.get("/", (req, res) => {
	if (req.session && req.session.username) {
		res.send(`welcome back ${req.session.username}`);
	} else {
		res.send("who are you? who, who?");
	}
});

// create a user with a hashed password
server.use("/api/register", Register);
// validate login and create a new session for a user
server.use("/api/login", authenticate, Login);
// log a user out of the current session
server.use("/api/logout", Logout);
// send an array of all users in the database
server.use("/api/restricted/users", Users);

server.listen(5000, () => {
	console.log("\n===api running on 5000===\n");
});
