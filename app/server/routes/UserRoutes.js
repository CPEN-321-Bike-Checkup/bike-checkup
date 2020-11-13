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
    console.log('registering device');
    UserService.RegisterNewDevice(req.body.userId, req.body.token);

    console.log('registered');
    res.sendStatus(200);
  });

  userRouter.post('/:userId/connectedStrava', (req, res, next) => {
    var user = req.body;
    UserService.CreateOrUpdateUser(user);
    res.sendStatus(200);
  });
};

module.exports = initUserRouting;
