const express = require('express');
const componentService = require('../services/ComponentService');

const initComponentRouting = (app) => {
  const componentRouter = express.Router();

  app.use('/component', componentRouter);

  componentRouter.get('/:bikeId', (req, res, next) => {
    componentService.GetComponentsForBike(parseInt(req.bikeId)).then(
      (components) => res.send(JSON.stringify(components)),
      (err) => res.send(JSON.stringify(err)),
    );
  });
};

module.exports = initComponentRouting;
