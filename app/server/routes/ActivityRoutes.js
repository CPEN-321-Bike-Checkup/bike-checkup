const express = require('express');
const activityService = require('../services/ActivityService');

const initActivityRouting = (app) => {
  const activityRouter = express.Router();

  app.use('/activity', activityRouter);

  //add error handling
  activityRouter.get('/:userId/', (req, res) => {
    activityService
      .GetActivitiesForUserInRange(
        parseInt(req.params.userId),
        new Date(req.query.afterDate),
        parseInt(req.query.numDays),
      )
      .then((activities) => {
        res.status(200).send(JSON.stringify(activities));
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  });
};

module.exports = initActivityRouting;
