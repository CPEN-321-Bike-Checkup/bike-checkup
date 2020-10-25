const express = require('express');
const UserService = require('../services/UserService').UserService;


const initUserRouting = (app) => {

	const userRouter = express.Router();

	app.use('/user', userRouter);



	userRouter.get('/:userId', (req, res, next) => {
		var user = UserService.getUserById(req.params[0]);
		res.send(JSON.stringify(user));
	});

	userRouter.get('/registerToken', (req, res, next) => {
		var user = UserService.mapDeviceToken(req.query.userId, req.query.deviceToken);
		res.send();
	});
}

module.exports = initUserRouting;