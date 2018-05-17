const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const session = require("express-session");
// const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
const jwt = require("jsonwebtoken");
const localStrategy = require("./middleware/login");
const jwtStrategy = require("./middleware/jwtStrategy");
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

// passport global middleware
passport.use(localStrategy);
passport.use(jwtStrategy);

// passport local middleware
const passportOptions = {
	session: false
};
const authenticate = passport.authenticate("local", passportOptions); // invokes req.login()
const protected = passport.authenticate("jwt", passportOptions);

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
server.use("/api/protected/users", protected, Users);

server.listen(5000, () => {
	console.log("\n===api running on 5000===\n");
});
