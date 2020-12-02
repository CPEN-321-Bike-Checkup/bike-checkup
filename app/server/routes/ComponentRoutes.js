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
      (err) => {
        console.log('error getting components', err);
        res.send(JSON.stringify(err));
      },
    );
  });

  componentRouter.post('/', (req, res) => {
    componentService
      .CreateComponents(req.body)
      .then((components) => res.status(201).send(JSON.stringify(components)))
      .catch((err) => {
        console.log('error creating component', err);
        if (err.name === 'ValidationError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  componentRouter.put('/', (req, res) => {
    componentService
      .Update(req.body)
      .then((result) => {
        if (
          (req.body.length !== undefined && req.body.length !== result.n) ||
          (req.body.length === undefined && result.n !== 1)
        ) {
          console.error('error updating component');
          res.status(404).send('Error: Component not Found');
        } else {
          res.status(200).send('Updated Component');
        }
      })
      .catch((err) => {
        console.log('error updating component', err);
        if (err.name === 'ValidationError' || err.name == 'CastError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else if (err.name === 'DocumentNotFoundError') {
          res.status(404).send('Error: Task not Found');
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
          console.error('error deleting component');
          res.status(404).send('Error: Component not found!');
        } else {
          res.status(200).send('Component deletion successful.');
        }
      })
      .catch((err) => {
        console.error('error deleting component', err);
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
