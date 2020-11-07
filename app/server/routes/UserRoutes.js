const express = require('express');
const UserService = require('../services/UserService');
const NotificationService = require('../services/NotificationService');


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

		var message = NotificationService.CreateMessage("Test Notification Name", 'Test Notification', 'This is a notification', {}, req.body.token);
		NotificationService.SendNotification(message);



		res.send('registered');
	});
}

module.exports = initUserRouting;