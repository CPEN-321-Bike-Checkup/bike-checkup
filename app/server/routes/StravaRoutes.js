const express = require('express');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const stravaService = require('../services/StravaService');
const userService = require('../services/UserService');

const initStravaRouting = (app) => {
  const stravaRouter = express.Router();

  app.use('/strava', stravaRouter);

  stravaRouter.post('/:userId/connectedStrava', async (req, res, next) => {
    var user = req.body;
    userService.CreateOrUpdateUsers(user).then(async (resp) => {
      await stravaService.UpdateBikesForUser(user._id);
      stravaService
        .SaveNewActivitiesForUser(user._id)
        .then((activitiesRes) => {
          maintenanceTaskService.MaintenancePredict(user._id);
          res.status(200);
          res.send(activitiesRes);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
    });
  });
};

module.exports = initStravaRouting;
