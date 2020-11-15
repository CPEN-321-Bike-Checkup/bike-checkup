const express = require('express');
const MaintenanceTaskService = require('../services/MaintenanceTaskService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const {Mongoose} = require('mongoose');

const initMaintenanceTaskRouting = (app) => {
  const maintenanceTaskRouter = express.Router();

  app.use('/maintenanceTask', maintenanceTaskRouter);

  maintenanceTaskRouter.get('/:userId/prediction', (req, res) => {
    deviceTokenRepo.GetAll().then(function (deviceTokens) {
      var dates = MaintenanceTaskService.MaintenancePredict(
        req.params[0],
        deviceTokens,
      );
      res.send(JSON.stringify({dates: dates}));
    });
  });

  maintenanceTaskRouter.get('/', (req, res, next) => {
    var dates = MaintenanceTaskService.GetScheduledTasksSorted(
      req.query.userId,
      req.query.numDays,
    );
    res.send(JSON.stringify({dates: dates}));
  });

  maintenanceTaskRouter.get(
    '/component/:componentId',
    async (req, res, next) => {
      var tasks = await maintenanceTaskService.GetTasksForComponent(
        req.params[0],
      );
      res.send(JSON.stringify(tasks));
    },
  );

  //userRouter.post('/registerDevice', (req, res, next) => {
  //  console.log('registering device');
  //  UserService.RegisterNewDevice(req.body.userId, req.body.token);

  //  console.log('registered');
  //  res.sendStatus(200);
  //});

  maintenanceTaskRouter.post('/', (req, res, next) => {
    var result = MaintenanceTaskService.Create(req.body)
      .then((result) => {
        res.statusCode(201);
        res.send('Created Task');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.statusCode(400);
          res.send('Error: Invalid Request syntax');
        } else {
          res.statusCode(500);
          res.send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.post('/complete', (req, res, next) => {
    var result = MaintenanceTaskService.MarkCompleted(req.body)
      .then((result) => {
        res.statusCode(201);
        res.send('Marked Task as Done');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.statusCode(400);
          res.send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.statusCode(404);
          res.send('Error: Task not Found');
        } else {
          res.statusCode(500);
          res.send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.put('/', (req, res, next) => {
    var result = MaintenanceTaskService.Update(req.body)
      .then((result) => {
        res.statusCode(200);
        res.send('Updated Task');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.statusCode(400);
          res.send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.statusCode(404);
          res.send('Error: Task not Found');
        } else {
          res.statusCode(500);
          res.send('Error: Internal Server Error');
        }
      });
  });

  maintenanceTaskRouter.delete('/', (req, res, next) => {
    var result = MaintenanceTaskService.Delete(req.body)
      .then((result) => {
        res.statusCode(200);
        res.send('Deleted Task');
      })
      .catch((err) => {
        if (err instanceof Mongoose.Error.ValidationError) {
          res.statusCode(400);
          res.send('Error: Invalid Request syntax');
        } else if (err instanceof Mongoose.Error.DocumentNotFoundError) {
          res.statusCode(404);
          res.send('Error: Task not Found');
        } else {
          res.statusCode(500);
          res.send('Error: Internal Server Error');
        }
      });
  });
};

module.exports = initMaintenanceTaskRouting;
