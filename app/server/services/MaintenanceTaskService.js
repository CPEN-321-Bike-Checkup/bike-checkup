const notificationService = require('./NotificationService');
const activityRepository = require('../repositories/ActivityRepository');
const maintenanceTaskRepository = require('../repositories/MaintenanceTaskRepository');
const moment = require('moment');
require('moment-timezone');

class MaintenanceTaskService {
  constructor(
    notificationService,
    activityRepository,
    maintenanceTaskRepository,
  ) {
    this.notificationService = notificationService;
    this.activityRepository = activityRepository;
    this.maintenanceTaskRepository = maintenanceTaskRepository;
  }

  MaintenancePredict(userId, deviceTokens) {
    //remove mock data later
    const maintSchedule1 = {
      maintenance_id: 1,
      component_id: 1,
      schedule_type: 'maintenance',
      threshold_val: 450,
      description: 'oil chain',
      last_maintenance_val: new Date('2020-10-20'),
    };

    const maintSchedule2 = {
      maintenance_id: 2,
      component_id: 3,
      schedule_type: 'maintenance',
      threshold_val: 180,
      description: 'tire check',
      last_maintenance_val: new Date('2020-10-20'),
    };

    const activity1 = {
      //activity_id: 1,
      description: 'test',
      distance: 50,
      time_s: 360,
      date: new Date('2020-10-21'),
      components: [1],
    };

    const activity2 = {
      //activity_id: 2,
      description: 'test2',
      distance: 30,
      time_s: 300,
      date: new Date('2020-10-22'),
      components: [2],
    };

    const activity3 = {
      //activity_id: 3,
      description: 'test3',
      distance: 50,
      time_s: 320,
      date: new Date('2020-10-22'),
      components: [3],
    };

    const activity4 = {
      //activity_id: 4,
      description: 'test4',
      distance: 60,
      time_s: 400,
      date: new Date('2020-10-25'),
      components: [3],
    };

    let maintenanceList = maintenanceTaskRepository.GetMaintenanceTasksForUser(
      userId,
    ); //[maintSchedule1, maintSchedule2];
    //let activityList = [activity1, activity2, activity3, activity4];

    const MILLISECONDS_PER_SECOND = 1000;
    const SECONDS_PER_DAY = 86400;

    function mean(vals) {
      var sum_vals = vals.reduce(function (accumulator, currVal) {
        return accumulator + currVal;
      }, 0);
      return sum_vals / vals.length;
    }

    function variance(vals, mean) {
      var sum_variance = vals.reduce(function (accumulator, currVal) {
        return accumulator + Math.pow(currVal - mean, 2);
      }, 0);
      return sum_variance;
    }

    function covarianceSum(x_vals, x_mean, y_vals, y_mean) {
      if (x_vals.length != y_vals.length) {
        //differing data set lengths
        return null;
      }
      var covariance_sum = 0.0;
      var i;
      for (i = 0; i < x_vals.length; i++) {
        covariance_sum += (x_vals[i] - x_mean) * (y_vals[i] - y_mean);
      }
      return covariance_sum;
    }

    function predictSlope(covariance, variance_x) {
      return covariance / variance_x;
    }

    function predictIntercept(mean_x, mean_y, slope) {
      return mean_y - slope * mean_x;
    }

    function addDays(currentDate, daysToAdd) {
      var final_date = new Date(currentDate);
      final_date.setDate(final_date.getDate() + daysToAdd);
      return final_date;
    }

    //get JSON data from Strava call
    //normalize units if necessary -> convert-units or just mile->km manual conversion
    //linear regression taken from: https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
    var predict_dates = [];
    var predictionText = '';
    var maint_index;
    for (maint_index = 0; maint_index < maintenanceList.length; maint_index++) {
      var last_maint_date = maintenanceList[
        maint_index
      ].last_maintenance_val.getTime();

      var activityList = activityRepository.GetActivitiesAfterDateForUser(
        userId,
        last_maint_date,
      );
      if (activityList.length == 0) {
        //no activities found, skip
        predict_dates.push(null);
        break;
      }

      var component_id = maintenanceList[maint_index].component_id;
      var distance_sum = 0;
      var activity_date_dataset = [0];
      var activity_distance_dataset = [0];
      var activity_index;
      for (
        activity_index = 0;
        activity_index < activityList.length;
        activity_index++
      ) {
        if (activityList[activity_index].components.includes(component_id)) {
          activity_date_dataset.push(
            (activityList[activity_index].date.getTime() - last_maint_date) /
              (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY),
          );
          distance_sum += activityList[activity_index].distance;
          activity_distance_dataset.push(distance_sum);
        }
      }

      var x_mean = mean(activity_date_dataset);
      var y_mean = mean(activity_distance_dataset);
      if (x_mean == null || y_mean == null) {
        //handle null error
        predict_dates.push(null);
        predictionText += 'error calculating' + '\n';
        break;
      }
      var x_variance = variance(activity_date_dataset, x_mean);
      var covar_sum = covarianceSum(
        activity_date_dataset,
        x_mean,
        activity_distance_dataset,
        y_mean,
      );
      if (x_variance == null || covar_sum == null) {
        //handle null error
        predict_dates.push(null);
        predictionText += 'error calculating' + '\n';
        break;
      }
      var slope = predictSlope(covar_sum, x_variance);
      var intercept = predictIntercept(x_mean, y_mean, slope);
      var predict_date =
        (maintenanceList[maint_index].threshold_val - intercept) / slope;
      var final_date = addDays(
        maintenanceList[maint_index].last_maintenance_val,
        predict_date,
      );

      final_date = moment(final_date, 'YYYY-MM-DD')
        .tz('America/Los_Angeles')
        .format('l');
      predict_dates.push(final_date);
      predictionText +=
        maintenanceList[maint_index].description +
        ' estimated due on: ' +
        final_date +
        '\n';
    }

    deviceTokens.forEach((t) => {
      console.log('', t);
      setTimeout(function () {
        notificationService.SendNotification(
          notificationService.CreateMessage(
            'Maintenance Schedule Prediction',
            'Upcoming Maintenance Predictions',
            predictionText,
            {},
            t.token,
          ),
        );
      }, 8000);
    });

    return predict_dates;
  }
}

const maintenanceTaskService = new MaintenanceTaskService(notificationService);
module.exports = maintenanceTaskService;
