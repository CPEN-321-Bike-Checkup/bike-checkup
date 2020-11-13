const express = require('express');
const MaintenanceTaskService = require('../services/MaintenanceTaskService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const {reseller} = require('googleapis/build/src/apis/reseller');

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
};

module.exports = initMaintenanceTaskRouting;
