const express = require('express');
const MaintenanceRecordService = require('../services/MaintenanceRecordService');

const initMaintenanceRecordRouting = (app) => {
  const maintenanceRecordRouter = express.Router();

  app.use('/maintenanceRecord', maintenanceRecordRouter);

  maintenanceRecordRouter.get(
    '/:userId/days/:daysOfHistory',
    (req, res, next) => {
      MaintenanceRecordService.getMaintenanceRecords(
        parseInt(req.params.userId),
        parseInt(req.params.daysOfHistory),
      ).then(
        (records) => res.send(JSON.stringify(records)),
        (err) => res.send(JSON.stringify(err)),
      );
    },
  );
};

module.exports = initMaintenanceRecordRouting;
