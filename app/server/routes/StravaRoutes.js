const express = require('express');
const StravaService = require('../services/StravaService');
const UserService = require('../services/UserService');

const initStravaRouting = (app) => {
  const stravaRouter = express.Router();

  app.use('/strava', stravaRouter);

  stravaRouter.post('/:userId/connectedStrava', async (req, res, next) => {
    var user = req.body;
    UserService.CreateOrUpdateUsers(user).then(async (resp) => {
      await StravaService.UpdateBikesForUser(user._id);
      await StravaService.SaveNewActivitiesForUser(user._id);
      res.sendStatus(200);
    });
  });
};

module.exports = initStravaRouting;
