const express = require('express');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const {Mongoose} = require('mongoose');
const {isInteger, isString} = require('lodash');

const initMaintenanceTaskRouting = (app) => {
  const maintenanceTaskRouter = express.Router();

  app.use('/maintenanceTask', maintenanceTaskRouter);

  maintenanceTaskRouter.get('/prediction', async (req, res) => {
    if (req.query.userId !== undefined && req.query.userId) {
      var predictions = await maintenanceTaskService.MaintenancePredictForUser(
        req.query.userId,
      );
      res.status(200).send(JSON.stringify(predictions));
    } else if (req.query.componentId !== undefined && req.query.componentId) {
      var prediction = await maintenanceTaskService.MaintenancePredictForComponent(
        req.query.componentId,
      );
      res.status(200).send(JSON.stringify(prediction));
    }
  });

  maintenanceTaskRouter.get('/', (req, res) => {
    var userId = parseInt(req.query.userId, 10);
    var componentId = req.query.componentId;
    if (isInteger(userId)) {
      //gets Overdue tasks, Todays tasks, this weeks tasks and the upcoming tasks for the user
      maintenanceTaskService
        .GetTaskScheduleForUser(userId)
        .then((tasks) => {
          res.send(JSON.stringify(tasks));
        })
        .catch((err) => {
          res.status(500).send('Internal server error');
        });
      //get tasks specific to component for component screen flow
    } else if (isString(componentId)) {
      maintenanceTaskService
        .GetTasksForComponent(componentId)
        .then((tasks) => {
          res.send(JSON.stringify(tasks));
        })
        .catch((err) => {
          console.err('GET maintenanceTask/ Error: ', err);
          res.status(500).send('Internal server error');
        });
    } else {
      res.status(400).send('Invalid query parameters');
    }
  });

  maintenanceTaskRouter.post('/', (req, res) => {
    maintenanceTaskService
      .Create(req.body)
      .then((tasks) => {
        res.status(201).send(tasks);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === 'ValidationError' || err.name == 'CastError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.post('/complete', (req, res) => {
    maintenanceTaskService
      .MarkCompleted(req.body)
      .then((result) => {
        res.status(201).send('Marked Task as Done');
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

  maintenanceTaskRouter.put('/', (req, res) => {
    maintenanceTaskService
      .Update(req.body)
      .then((result) => {
        if (
          (req.body.length !== undefined && req.body.length !== result.n) ||
          (req.body.length === undefined && result.n !== 1)
        ) {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(200).send('Updated Task');
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

  maintenanceTaskRouter.delete('/', (req, res) => {
    maintenanceTaskService
      .Delete(req.body)
      .then((result) => {
        if (
          (req.body.length !== undefined && req.body.length !== result.n) ||
          (req.body.length === undefined && result.n !== 1)
        ) {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(200).send('Deleted Task');
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

module.exports = initMaintenanceTaskRouting;
