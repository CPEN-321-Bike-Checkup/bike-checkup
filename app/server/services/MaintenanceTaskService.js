const activityRepository = require('../repositories/ActivityRepository');
const maintenanceTaskRepository = require('../repositories/MaintenanceTaskRepository');
const moment = require('moment');
const maintenanceRecordRepository = require('../repositories/MaintenanceRecordRepository');
require('moment-timezone');

class MaintenanceTaskService {
  constructor(
    activityRepository,
    maintenanceTaskRepository,
    maintenanceRecordRepository,
  ) {
    this.activityRepository = activityRepository;
    this.maintenanceTaskRepository = maintenanceTaskRepository;
    this.maintenanceRecordRepository = maintenanceRecordRepository;
  }

  GetById(id) {
    return this.maintenanceTaskRepository.GetById(id);
  }

  Create(maintenanceTask) {
    return this.maintenanceTaskRepository.Create(maintenanceTask);
  }

  MarkCompleted(maintenanceTask) {
    var updateResult = this.maintenanceTaskRepository.Update(maintenanceTask);
    var createRecordResult = this.maintenanceRecordRepository.Create(
      MaintenanceRecordFromTask(maintenanceTask),
    );
  }

  Update(maintenanceTask) {
    return this.maintenanceTaskRepository.Update(maintenanceTask);
  }

  Delete(maintenanceTask) {
    return this.maintenanceTaskRepository.Delete(maintenanceTask);
  }

  MaintenanceRecordFromTask(maintenanceTask) {
    var record = {};
    return record;
  }

  /*
   * Gets all tasks in the future within certain range of days
   * @param     userId - id of user whose tasks are to be retrieved
   * @param     num_of_days - cut off number of days in the future for
   *            tasks to display
   * @returns   array of tasks within given predicted date range sorted
   *            by predicted date ascending
   * @modifies  nothing
   */

  GetScheduledTasksSorted(userId, numDays) {
    const num_of_days = 50;
    let all_tasks = maintenanceTaskRepository.GetMaintenanceTasksForUser(
      userId,
    );

    let cutoff_date = this.addDays(new Date(), num_of_days);
    let filtered_tasks = all_tasks.filter(function (value, index, arr) {
      return arr[index].predicted_due_date <= cutoff_date;
    });

    let sorted_tasks = filtered_tasks.sort(function (x, y) {
      return x.predicted_due_date - y.predicted_due_date;
    });

    //console.log(sorted_tasks);
    return sorted_tasks;
  }

  addDays(currentDate, daysToAdd) {
    var final_date = new Date(currentDate);
    final_date.setDate(final_date.getDate() + daysToAdd);
    return final_date;
  }

  /*
   * Gets all tasks for user and predicts new due dates according
   * to user's activities
   * @param     userId - id of user whose tasks are to be retrieved
   * @param     deviceTokens - device token used to send notifications
   * @returns   array of maintenance tasks with updated predicted_due_dates
   * @modifies  database entries of MaintenanceTask items
   */

  GetTasksForComponent(componentId) {
    var tasks = this.maintenanceTaskRepository.GetTasksForComponent(
      componentId,
    );
    return tasks.map((task) => {
      return {
        'task id': task._id,
        description: task.description,
        threshold: task.threshold_val,
        repeats: task.repeats,
        last_maintenance_val: task.last_maintenance_val,
      };
    });
  }

  async MaintenancePredict(userId) {
    //remove mock data later

    let maintenanceList = await maintenanceTaskRepository.GetMaintenanceTasksForUser(
      userId,
    );

    maintenanceList = maintenanceList.filter(function (value, index, arr) {
      return arr[index].schedule_type == 'distance';
    });

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

    //get JSON data from Strava call
    //normalize units if necessary -> convert-units or just mile->km manual conversion
    //linear regression taken from: https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
    var predict_dates = [];
    var predictionText = '';
    var maint_index;
    for (maint_index = 0; maint_index < maintenanceList.length; maint_index++) {
      //no predictions to be made if schedule is not distance based
      //console.log(maintenanceList[maint_index].schedule_type);
      if (maintenanceList[maint_index].schedule_type != 'distance') {
        //console.log('not the right schedule type!!!');
        predict_dates.push(null);
        continue;
      }
      var last_maint_date = maintenanceList[
        maint_index
      ].last_maintenance_val.getTime();

      var activityList = await activityRepository.GetActivitiesAfterDateForUser(
        userId,
        last_maint_date,
      );
      if (activityList.length == 0) {
        //no activities found, make no changes to predicted_due_date, skip
        predict_dates.push(null); //predict dates used to debug on maintenance screen
        continue;
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
        //handle null error, make no changes to predicted_due_date, skip
        predict_dates.push(null); //predict dates used to debug on maintenance screen
        continue;
      }
      var x_variance = variance(activity_date_dataset, x_mean);
      var covar_sum = covarianceSum(
        activity_date_dataset,
        x_mean,
        activity_distance_dataset,
        y_mean,
      );
      if (x_variance == null || covar_sum == null) {
        //handle null error, make no changes to predicted_due_date, skip
        predict_dates.push(null); //predict dates used to debug on maintenance screen
        continue;
      }
      var slope = predictSlope(covar_sum, x_variance);
      var intercept = predictIntercept(x_mean, y_mean, slope);
      var predict_date =
        (maintenanceList[maint_index].threshold_val - intercept) / slope;
      var final_date = this.addDays(
        maintenanceList[maint_index].last_maintenance_val,
        predict_date,
      );

      //update with new predicted date
      maintenanceList[maint_index].predicted_due_date = final_date;

      //formatting for debug maintenance screen
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

    this.maintenanceTaskRepository.Update(maintenanceList);
    return predict_dates;
  }
}

const maintenanceTaskService = new MaintenanceTaskService(
  activityRepository,
  maintenanceTaskRepository,
  maintenanceRecordRepository,
);
module.exports = maintenanceTaskService;
