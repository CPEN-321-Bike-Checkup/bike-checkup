const schedule = require('node-schedule');
const maintenanceTaskService = require('./MaintenanceTaskService');
const notificationService = require('./NotificationService');
const userService = require('./UserService');

class AutoReminderService {
  constructor(notificationService, maintenanceTaskSerivice, userService) {
    this.notificationService = notificationService;
    this.maintenanceTaskSerivice = maintenanceTaskSerivice;
    this.userService = userService;
  }

  RunJob() {
    return new Promise(async (resolve, reject) => {
      var users = await this.userService.GetAllUsers();

      for (var i = 0; i < users.length; i++) {
        var devicesPromise = this.userService.GetUserDevices(users[i]._id);
        var tasksPromise = this.maintenanceTaskSerivice.MaintenancePredictForUser(
          users[i]._id,
        );
        Promise.all([devicesPromise, tasksPromise, users[i]])
          .then(async ([devices, predictedDates, user]) => {
            var schedule = await this.maintenanceTaskSerivice.GetTaskScheduleForUser(
              user,
            );
            var messageBody = '';
            var numOverdue = schedule[0].data.length;
            var numThisWeek = schedule[1].data.length + schedule[2].data.length;
            if (numOverdue > 0) {
              messageBody = messageBody.concat(
                'Tasks overdue: ' + numOverdue + '\n',
              );
            }
            if (numThisWeek > 0) {
              messageBody = messageBody.concat(
                'Tasks due this week: ' + numThisWeek + '\n',
              );
            }

            for (var j = 0; j < devices.length; j++) {
              var message = this.notificationService.CreateMessage(
                'Weekly Maintenance Alert',
                'Weekly Maintenance Tasks Alert',
                messageBody,
                {},
                devices[j].token,
              );
              this.notificationService.SendNotification(message);
            }
          })
          .catch((err) => {
            console.error('Error running reminder service: ', err);
            reject(err);
          });
      }
      resolve('Job ran successfully');
    });
  }

  StartJobSchedule() {
    //Run job every monday at midnight
    var jobSchedule = schedule.scheduleJob('0 0 0 * * 1', () => {
      this.RunJob();
    });
  }
}
const autoReminderService = new AutoReminderService(
  notificationService,
  maintenanceTaskService,
  userService,
);

module.exports = autoReminderService;
