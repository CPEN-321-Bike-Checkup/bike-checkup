const express = require('express');
const BikeService = require('../services/BikeService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');

const initBikeRouting = (app) => {
  const bikeRouter = express.Router();

  app.use('/bike', bikeRouter);

  bikeRouter.get('/:userId/bikes', (req, res) => {
    deviceTokenRepo.GetAll().then(function (deviceTokens) {
      console.log('correct bike route');
      var bikes = BikeService.getBikes(req.params[0]);
      res.send(JSON.stringify({bikes: bikes}));
    });
  });
};

module.exports = initBikeRouting;
