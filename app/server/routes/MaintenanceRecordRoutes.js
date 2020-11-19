const express = require('express');
const MaintenanceRecordService = require('../services/MaintenanceRecordService');

const initMaintenanceRecordRouting = (app) => {
  const maintenanceRecordRouter = express.Router();

  app.use('/maintenanceRecord', maintenanceRecordRouter);

  maintenanceRecordRouter.get('/:userId/', (req, res, next) => {
    if (req.query.afterDate !== undefined && req.query.numDays !== undefined) {
      MaintenanceRecordService.GetMaintenanceRecordsForUserInRange(
        parseInt(req.params.userId),
        req.query.afterDate,
        req.query.numDays,
      )
        .then((records) => {
          res.status(200).send(JSON.stringify(records));
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    }
  });
};

module.exports = initMaintenanceRecordRouting;
