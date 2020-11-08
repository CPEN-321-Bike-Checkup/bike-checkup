const express = require('express');
const MaintenanceTaskService = require('../services/MaintenanceTaskService');
const deviceTokenRepo = require('../repositories/DeviceTokenRepository');

const initMaintenanceTaskRouting = (app) => {
  const maintenanceTaskRouter = express.Router();

  app.use('/maintenanceTask', maintenanceTaskRouter);

  maintenanceTaskRouter.get('/prediction', (req, res, next) => {
    deviceTokenRepo.GetAll().then(function (userId, devices) {
      var dates = MaintenanceTaskService.MaintenancePredict(userId, devices);
      res.send(JSON.stringify({dates: dates}));
    });
  });
};

module.exports = initMaintenanceTaskRouting;
