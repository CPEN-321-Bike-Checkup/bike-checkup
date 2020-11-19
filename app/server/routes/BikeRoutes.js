const express = require('express');
const bikeService = require('../services/BikeService');

const initBikeRouting = (app) => {
  const bikeRouter = express.Router();

  app.use('/bike', bikeRouter);

  //add error handling
  bikeRouter.get('/:userId/', async (req, res) => {
    var bikes = await bikeService
      .GetBikesForUser(parseInt(req.params.userId))
      .then((bikes) => {
        res.status(200).send(JSON.stringify(bikes));
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
};

module.exports = initBikeRouting;
