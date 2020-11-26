const activityRepository = require('../repositories/ActivityRepository');
const componentActivityRepository = require('../repositories/ComponentActivityRepository');
const maintenanceTaskRepository = require('../repositories/MaintenanceTaskRepository');
const bikeRepository = require('../repositories/BikeRepository');
const moment = require('moment');
const maintenanceRecordRepository = require('../repositories/MaintenanceRecordRepository');
const bikeService = require('./BikeService');
const componentRepository = require('../repositories/ComponentRepository');
require('moment-timezone');

class MaintenanceTaskService {
  constructor(
    activityRepository,
    maintenanceTaskRepository,
    maintenanceRecordRepository,
    componentActivityRepository,
    bikeRepository,
    componentRepository,
  ) {
    this.activityRepository = activityRepository;
    this.maintenanceTaskRepository = maintenanceTaskRepository;
    this.maintenanceRecordRepository = maintenanceRecordRepository;
    this.componentActivityRepository = componentActivityRepository;
    this.bikeRepository = bikeRepository;
    this.componentRepository = componentRepository;
  }

  GetById(id) {
    var promise = this.maintenanceTaskRepository.GetById(id);
    return promise;
  }

  Create(maintenanceTasks) {
    maintenanceTasks.last_maintenance_val = new Date();
    var promise = this.maintenanceTaskRepository.Create(maintenanceTasks);
    return promise;
  }

  async MarkCompleted(maintenanceTasks) {
    var promises = [];
    for (var i = 0; i < maintenanceTasks.length; i++) {
      let taskResult;
      var task = await this.maintenanceTaskRepository.GetById(t._id);
      if (task.repeats) {
        taskResult = this.maintenanceTaskRepository.Update(maintenanceTask);
      } else {
        taskResult = this.maintenanceTaskRepository.Delete(task);
      }
      var createRecordResult = this.maintenanceRecordRepository.Create(
        this.MaintenanceRecordFromTask(maintenanceTask),
      );
      promises.concat([taskResult, createRecordResult]);
    }
    return Promise.all(promises);
  }

  Update(maintenanceTask) {
    var promise = this.maintenanceTaskRepository.Update(maintenanceTask);
    return promise;
  }

  Delete(maintenanceTask) {
    var promise = this.maintenanceTaskRepository.Delete(maintenanceTask);
    return promise;
  }

  MaintenanceRecordFromTask(maintenanceTask) {
    var record = {
      description: maintenanceTask.description,
      component_id: maintenanceTask.component_id,
      maintenance_date: maintenanceTask.last_maintenance_val,
    };
    return record;
  }

  //assumes predicted due dates are stored as only a date not a time
  async GetTaskScheduleForUser(userId) {
    var taskPromise = this.GetScheduledTasksSorted(userId);
    var bikesPromise = this.bikeRepository.GetBikesForUser(userId);
    var componentsPromise = this.componentRepository.GetComponentsForUser(
      userId,
    );
    var [taskData, bikeData, componentData] = await Promise.all([
      taskPromise,
      bikesPromise,
      componentsPromise,
    ]);
    var tasks = [];

    taskData.forEach((task) => {
      var comp = componentData.find((c) => c._id.equals(task.component_id));
      var bike = bikeData.find((b) => b._id === comp.bike_id);
      var taskView = {
        taskId: task._id,
        bike: bike.label,
        task: task.description,
        component: comp.label,
        date: task.predicted_due_date,
        repeats: task.repeats,
        threshold_val: task.threshold_val,
      };
      tasks.push(taskView);
    });

    var schedule = [
      {
        title: 'Overdue',
        data: [],
      },
      {
        title: 'Today',
        data: [],
      },
      {
        title: 'Next 7 Days',
        data: [],
      },
      {
        //feel free to change this title
        //only includes tasks after next 7 days
        title: 'Upcoming',
        data: [],
      },
    ];

    let todayWithTime = new Date();
    let today = new Date(
      todayWithTime.getFullYear(),
      todayWithTime.getMonth(),
      todayWithTime.getDate(),
    );
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].date < today) {
        schedule[0].data.push(tasks[i]);
      } else if (tasks[i].date === today) {
        schedule[1].data.push(tasks[i]);
      } else if (
        tasks[i].date > today &&
        tasks[i].date < this.addDays(today, 7)
      ) {
        schedule[2].data.push(tasks[i]);
      } else {
        schedule[3].data.push(tasks[i]);
      }
    }
    return schedule;
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

  async GetScheduledTasksSorted(userId, numDays = 0) {
    var all_tasks = await this.maintenanceTaskRepository.GetMaintenanceTasksForUser(
      userId,
    );

    let filtered_tasks;
    if (numDays > 0) {
      let cutoff_date = this.addDays(new Date(), numDays);
      filtered_tasks = all_tasks.filter(function (value, index, arr) {
        return arr[index].predicted_due_date <= cutoff_date;
      });
    } else {
      filtered_tasks = all_tasks;
    }

    let sorted_tasks = filtered_tasks.sort(function (x, y) {
      return x.predicted_due_date - y.predicted_due_date;
    });

    return sorted_tasks;
  }

  addDays(currentDate, daysToAdd) {
    var final_date = new Date(currentDate);
    final_date.setDate(final_date.getDate() + daysToAdd);
    return final_date;
  }

  async GetTasksForComponent(componentId) {
    var tasks = await this.maintenanceTaskRepository.GetMaintenanceTasksForComponents(
      componentId,
    );

    return tasks.map((task) => {
      return {
        taskId: task._id,
        description: task.description,
        threshold: task.threshold_val,
        repeats: task.repeats,
        lastMaintenanceVal: task.last_maintenance_val,
        scheduleType: task.schedule_type,
      };
    });
  }

  async MaintenancePredictForComponent(componentId) {
    console.log('predicting for component...'); //DEBUG
    let maintenanceList = await this.maintenanceTaskRepository.GetMaintenanceTasksForComponents(
      componentId,
    );

    return this.MaintenancePredict(maintenanceList);
  }

  //TODO make the equivalent for component and use that function to do this for user
  async MaintenancePredictForUser(userId) {
    console.log('predicting for user...'); //DEBUG
    let maintenanceList = await this.maintenanceTaskRepository.GetMaintenanceTasksForUser(
      userId,
    );

    return this.MaintenancePredict(maintenanceList);
  }

  //TODO make the equivalent for component and use that function to do this for user
  async MaintenancePredict(maintenanceList) {
    return new Promise(async (resolve, reject) => {
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

      //linear regression taken from: https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
      var predict_dates = [];
      var predictionText = '';
      var maint_index;

      for (
        maint_index = 0;
        maint_index < maintenanceList.length;
        maint_index++
      ) {
        //retrieve all activities since maintenance day for specified component
        var last_maint_date = maintenanceList[
          maint_index
        ].last_maintenance_val.getTime();
        var component_id = maintenanceList[maint_index].component_id;

        var activityListId = await componentActivityRepository.GetActivityIdsForComponent(
          component_id,
        );
        if (componentActivityList.length == 0) {
          //no activities found, make no changes to predicted_due_date, skip
          continue;
        }

        var activityList = await activityRepository.GetActivitiesByIdsAfterDate(
          activityListId,
          last_maint_date,
        );

        //create x data (days) and y data (distance travelled)
        var distance_sum = 0;
        var activity_date_dataset = [0];
        var activity_distance_dataset = [0];
        var activity_index;

        for (
          activity_index = 0;
          activity_index < activityList.length;
          activity_index++
        ) {
          activity_date_dataset.push(
            (activityList[activity_index].date.getTime() - last_maint_date) /
              (MILLISECONDS_PER_SECOND * SECONDS_PER_DAY),
          );
          distance_sum += activityList[activity_index].distance;
          activity_distance_dataset.push(distance_sum);
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
      resolve(predict_dates);
    });
  }
}

const maintenanceTaskService = new MaintenanceTaskService(
  activityRepository,
  maintenanceTaskRepository,
  maintenanceRecordRepository,
  componentActivityRepository,
  bikeRepository,
  componentRepository,
);
module.exports = maintenanceTaskService;
