const express = require('express');
const UserService = require('../services/UserService');

const initUserRouting = (app) => {
  const userRouter = express.Router();

  app.use('/user', userRouter);
  
   userRouter.post('/', (req, res, next) => {
    console.log('Creating user');
    UserService.CreateUsers(req.body)
      .then((result) => {
        res.status(200).send(result);
        console.log('Created user');
      })
      .catch((err) => {
        console.error('error creating user', err);
        res.sendStatus(500);
      });
  });

  userRouter.get('/:userId', (req, res, next) => {
    UserService.getUserById(req.params[0])
      .then((user) => {
        res.send(JSON.stringify(user));
      })
      .catch((err) => {
        console.error('error getting user data', err);
        res.status(500).send('error getting user data');
      });
  });

  userRouter.post('/registerDevice', (req, res, next) => {
    console.log('Registering device');
    UserService.RegisterNewDevice(req.body.userId, req.body.token)
      .then((result) => {
        res.sendStatus(200);
        console.log('Device registered');
      })
      .catch((err) => {
        console.error('error registering device', err);
        res.sendStatus(500);
      });
  });

  userRouter.delete('/registerDevice', (req, res, next) => {
    UserService.DeleteDevice(req.body.userId, req.body.token)
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.error('error deleting device', err);
        res.sendStatus(500);
      });
  });

 module.exports = initUserRouting;
