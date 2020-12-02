const express = require('express');
const {isInteger} = require('lodash');
const bikeService = require('../services/BikeService');

const initBikeRouting = (app) => {
  const bikeRouter = express.Router();

  app.use('/bike', bikeRouter);

  bikeRouter.post('/', (req, res) => {
    bikeService
      .CreateBike(req.body)
      .then((bikes) => res.status(201).send(JSON.stringify(bikes)))
      .catch((err) => {
        console.log('Error creating bikes', err);
        if (err.name === 'ValidationError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  bikeRouter.get('/', (req, res, next) => {
    bikeService
      .GetAllBikes()
      .then((bike) => {
        res.send(JSON.stringify(bike));
      })
      .catch((err) => {
        console.error('error getting user data', err);
        res.status(500).send('error getting user data');
      });
  });

  //add error handling
  bikeRouter.get('/:userId/', (req, res) => {
    var userId = parseInt(req.params.userId, 10);
    if (isInteger(userId)) {
      bikeService
        .GetBikesForUser(userId)
        .then((bikes) => {
          res.status(200).send(JSON.stringify(bikes));
        })
        .catch((err) => {
          console.error('error getting bikes for user', err);
          res.status(500).send(err);
        });
    } else {
      console.error('error getting bikes for user, invalid user paramerter');
      status(400).send('Improper user parameter');
    }
  });
};

module.exports = initBikeRouting;
