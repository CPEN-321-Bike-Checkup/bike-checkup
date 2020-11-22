const express = require('express');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const {Mongoose} = require('mongoose');

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
    if (req.query.userId !== undefined && req.query.userId) {
      //gets Overdue tasks, Todays tasks, this weeks tasks and the upcoming tasks for the user
      maintenanceTaskService
        .GetTaskScheduleForUser(req.query.userId)
        .then((tasks) => {
          res.send(JSON.stringify(tasks));
        })
        .catch((err) => {
          res.status(500).send('Internal server error');
        });
      //get tasks specific to component for component screen flow
    } else if (req.query.componentId !== undefined && req.query.componentId) {
      maintenanceTaskService
        .GetTasksForComponent(req.query.componentId)
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

  //maintenanceTaskRouter.get('/', (req, res, next) => {
  //  var dates = MaintenanceTaskService.GetScheduledTasksSorted(
  //    req.query.userId,
  //    50,
  //  ).catch((err) => {
  //    if (err instanceof Mongoose.Error.ValidationError) {
  //      res.status(400).send('Error: Invalid Request syntax');
  //    } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
  //      res.status(404).send('Error: Task not Found');
  //    } else {
  //      res.status(500).send('Error: Internal Server Error');
  //    }
  //  });
  //  res.send(JSON.stringify({dates: dates}));
  //});

  //maintenanceTaskRouter.get(
  //  '/component/:componentId',
  //  async (req, res, next) => {
  //    var tasks = await maintenanceTaskService.GetTasksForComponent(
  //      req.params[0],
  //    );
  //    res.send(JSON.stringify(tasks));
  //  },
  //);

  //userRouter.post('/registerDevice', (req, res, next) => {
  //  console.log('registering device');
  //  UserService.RegisterNewDevice(req.body.userId, req.body.token);

  //  console.log('registered');
  //  res.sendStatus(200);
  //});

  maintenanceTaskRouter.post('/', (req, res) => {
    maintenanceTaskService
      .Create(req.body)
      .then((tasks) => {
        res.status(201).send(tasks);
      })
      .catch((err) => {
        console.error(err);
        if (err.name === 'ValidationError') {
          res.status(400).send('Error: Invalid Request syntax');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.post('/complete', (req, res) => {
    var result = maintenanceTaskService
      .MarkCompleted(req.body)
      .then((result) => {
        res.status(201).send('Marked Task as Done');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.status(400).send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.put('/', (req, res) => {
    var result = maintenanceTaskService
      .Update(req.body)
      .then((result) => {
        res.status(200).send('Updated Task');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.status(400).send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.delete('/', (req, res) => {
    var result = maintenanceTaskService
      .Delete(req.body)
      .then((result) => {
        res.status(200).send('Deleted Task');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.status(400).send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.status(404).send('Error: Task not Found');
        } else {
          res.status(500).send('Error: Internal Server Error');
        }
      });
  });
};

module.exports = initMaintenanceTaskRouting;
