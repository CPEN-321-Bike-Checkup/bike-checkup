const express = require('express');
const UserService = require('../services/UserService');


const initUserRouting = (app) => {

	const userRouter = express.Router();

	app.use('/user', userRouter);



	userRouter.get('/:userId', (req, res, next) => {
		var user = UserService.getUserById(req.params[0]);
		res.send(JSON.stringify(user));
	});

	userRouter.post('/registerDevice', (req, res, next) => {
		console.log("registering device");
		UserService.RegisterNewDevice(req.body.userId, req.body.token);
		res.send('registered');
	});
}

module.exports = initUserRouting;