const router = require("express").Router();
const User = require("../users/userModel");
const makeToken = require("../middleware/makeToken");

router.post("/", (req, res) => {
	// instantiate a new user with the given user data
	const user = new User(req.body);

	user
		.save()
		.then(user => {
			// create a token
			const token = makeToken(user);
			res.status(201).send({ user, token });
		})
		.catch(err => {
			res.status(500).send(err);
		});
});

module.exports = router;
