const router = require("express").Router();
const User = require("../users/userModel");
const makeToken = require("../middleware/makeToken");

const secret = "that is what I shared yesterday lol";

router.post("/", (req, res) => {
	// login successful - return token and user
	res.status(200).json({ token: makeToken(req.user), user: req.user });
});

module.exports = router;
