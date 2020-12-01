const express = require('express');
const maintenanceTaskService = require('../services/MaintenanceTaskService');
const stravaService = require('../services/StravaService');
const userService = require('../services/UserService');
const _ = require('lodash');

const initStravaRouting = (app) => {
  const stravaRouter = express.Router();

  app.use('/strava', stravaRouter);

  stravaRouter.post('/:userId/connectedStrava', async (req, res) => {
    var user = req.body;
    if (_.isString(user._id)) {
      user._id = parseInt(user._id);
    }
    var userPromise = await userService.CreateOrUpdateUsers(user);
    stravaService.UpdateBikesForUser(user._id);
    stravaService
      .UpdateActivitiesForUser(user._id)
      .then((activitiesRes) => {
        stravaService
          .UpdateComponentActivitiesForUser(user._id)
          .then((compActivitiesRes) => {
            res.status(200).send('Sync Strava OK');
          });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(err);
      });
  });
};

module.exports = initStravaRouting;
