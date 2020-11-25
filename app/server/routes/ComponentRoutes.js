const express = require('express');
const componentService = require('../services/ComponentService');

const initComponentRouting = (app) => {
  const componentRouter = express.Router();

  app.use('/component', componentRouter);

  componentRouter.get('/:bikeId', (req, res) => {
    componentService.GetComponentsForBike(req.params.bikeId).then(
      (components) => {
        res.send(JSON.stringify(components));
      },
      (err) => res.send(JSON.stringify(err)),
    );
  });

  componentRouter.post('/', (req, res) => {
    componentService
      .CreateComponents(req.body)
      .then((components) => res.status(201).send(JSON.stringify(components)))
      .catch((err) => {
        console.error(err);
        if (err.name === 'ValidationError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });
};

module.exports = initComponentRouting;
