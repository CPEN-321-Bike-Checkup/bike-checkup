const express = require('express');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const stravaService = require('../services/StravaService');
const userService = require('../services/UserService');

const initStravaRouting = (app) => {
  const stravaRouter = express.Router();

  app.use('/strava', stravaRouter);

  stravaRouter.post('/:userId/connectedStrava', async (req, res) => {
    var user = req.body;
    var userPromise = await userService.CreateOrUpdateUsers(user);
    var userId = userPromise[0]._id;
    stravaService.UpdateBikesForUser(userId);
    stravaService
      .UpdateActivitiesForUser(userId)
      .then((activitiesRes) => {
        stravaService
          .UpdateComponentActivitiesForUser(userId)
          .then((compActivitiesRes) => {
            //maintenanceTaskService.MaintenancePredictForUser(user._id);
            res.status(200);
            res.send('Sync Strava OK');
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });
};

module.exports = initStravaRouting;
