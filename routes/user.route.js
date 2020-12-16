const router = require('express').Router();
const User = require('../models/user.model');
//Hashing library
const bcrypt = require('bcryptjs');
//Token Library
const jwt = require('jsonwebtoken');
const verify = require('./modules/verifyToken');
const validation = require('./modules/joiValidation');

router.post('/register', async (req, res) => {
	const user = req.body;

	let { error, value } = validation.validateUser(user);
	console.log(error);
	if (error) return res.status(200).send(error);

	const EmailDubCheck = await User.exists({ email: user.email.toLowerCase() });
	if (EmailDubCheck) return res.status(400).send('Email is already in use');

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(user.password, salt);

	const userModel = new User({
		email: user.email.toLowerCase(),
		password: hashedPassword,
		username: user.username
	});

	userModel
		.save()
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.post('/login', async (req, res) => {
	const user = await User.findOne({ email: req.body.email.toLowerCase() });
	if (!user) return res.json({ err: true, msg: '*Email or password is wrong' }).send();

	const validPass = await bcrypt.compare(req.body.password, user.password);
	if (!validPass) return res.json({ err: true, msg: '*Email or password is wrong' }).send();

	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

	res
		.cookie('auth_token', token, {
			maxAge: 7 * 24 * 60 * 60 * 1000,
			httpOnly: true
			// secure: true
		})
		.send();
});

router.post('/logout', verify, (req, res) => {
	res
		.cookie('auth_token', null, {
			maxAge: 0
		})
		.send();
});

router.post('/isLoggedIn', verify, (req, res) => {
	console.log('isLoggedIn = true');
	res.json({ loggedIn: true });
});

router.get('/usernames', verify, (req, res) => {
	User.find({ username: { $ne: null } }, { _id: 1, username: 1 })
		.then((users) => {
			res.status(200).json(users).send();
		})
		.catch((err) => {
			res.status(500).send(err);
		});
});

module.exports = router;
