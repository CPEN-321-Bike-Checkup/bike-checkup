const express = require('express');
const ComponentService = require('../services/ComponentService');

const initComponentRouting = (app) => {
  const componentRouter = express.Router();

  app.use('/component', componentRouter);

  componentRouter.get(
    '/:bikeId',
    (req, res, next) => {
        ComponentService.getComponents(parseInt(req.params.bikeId))
            .then(
                (components) => res.send(JSON.stringify(components)),
                (err) => res.send(JSON.stringify(err)),
            );
    },
  );
};

module.exports = initComponentRouting;
