const express = require('express');
const {isDate, isInteger} = require('lodash');
const activityService = require('../services/ActivityService');

const initActivityRouting = (app) => {
  const activityRouter = express.Router();

  app.use('/activity', activityRouter);

  //add error handling
  activityRouter.get('/:userId/', (req, res) => {
    var userId = parseInt(req.params.userId, 10);
    var afterDate = new Date(req.query.afterDate);
    var numberOfDays = parseInt(req.query.numDays, 10);
    if (isInteger(userId) && isDate(afterDate) && isInteger(numberOfDays)) {
      activityService
        .GetActivitiesForUserInRange(userId, afterDate, numberOfDays)
        .then((activities) => {
          res.status(200).send(JSON.stringify(activities));
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send(err);
        });
    } else {
      res.status(400).send('Incorrect query parameters');
    }
  });
};

module.exports = initActivityRouting;
