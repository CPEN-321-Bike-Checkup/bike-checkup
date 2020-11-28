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

  componentRouter.delete('/', (req, res) => {
    componentService
      .Delete(req.body)
      .then((result) => {
        if (
          (req.body.length !== undefined && req.body.length !== result.n) ||
          (req.body.length === undefined && result.n !== 1)
        ) {
          res.status(404).send('Error: Component not found!');
        } else {
          res.status(200).send('Component deletion successful.');
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.name === 'ValidationError' || err.name == 'CastError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else if (err.name === 'DocumentNotFoundError') {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });
};

module.exports = initComponentRouting;
