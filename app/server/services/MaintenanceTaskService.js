const notificationService = require('./NotificationService');
const moment = require('moment');
require('moment-timezone');

class MaintenanceScheduleService{

	constructor(notificationService){
		this.notificationService = notificationService;
	}

	MaintenancePredict(deviceTokens) {
		
		const maintSchedule1 = {
		    maintenance_id: 1,
		    component_id: 1,
		    schedule_type: "maintenance",
		    threshold_val: 450,
		    description: "oil chain",
		    last_maintenance_val: new Date('2020-10-20'),
		};
		
		const maintSchedule2 = {
		    maintenance_id: 2,
		    component_id: 3,
		    schedule_type: "maintenance",
		    threshold_val: 180,
		    description: "tire check",
		    last_maintenance_val: new Date('2020-10-23'),
		};
		
		const activity1 = {
		    activity_id: 1,
		    distance: 50,
		    date: new Date('2020-10-21')
		};
		
		const activity2 = {
		    activity_id: 2,
		    distance: 30,
		    date: new Date('2020-10-22')
		};
		
		const activity3 = {
		    activity_id: 3,
		    distance: 50,
		    date: new Date('2020-10-22')
		};
		
		const activity4 = {
		    activity_id: 4,
		    distance: 60,
		    date: new Date('2020-10-25')
		};
		
		let maintenanceList = [maintSchedule1, maintSchedule2];
		let activityList = [activity1, activity2, activity3, activity4];

		const millisecondsInADay = 86400000;

		function mean(vals) {
		    var sum_vals = vals.reduce(function(accumulator, currVal){
		        return accumulator + currVal;
		    }, 0);
		    return sum_vals / vals.length;
		}
		
		function variance(vals, mean) {
		    var sum_variance = vals.reduce(function(accumulator, currVal){
		        return accumulator + Math.pow(currVal - mean, 2);
		    }, 0);
		    return sum_variance;
		}
		
		function covariance(x_vals, x_mean, y_vals, y_mean) {
		    if (x_vals.length != y_vals.length) {
		        //differing data set lengths
		        return null;
		    }
		    var covariance = 0.0;
		    var i;
		    for (i = 0; i < x_vals.length; i++) {
		        covariance += (x_vals[i] - x_mean)  * (y_vals[i] - y_mean)
		    }
		    return covariance;
		}
		
		function predictSlope(covariance, variance_x) {
		    return covariance / variance_x;
		}
		
		function predictIntercept(mean_x, mean_y, slope) {
		    return mean_y - slope * mean_x;
		}
		
		function addDays (currentDate, daysToAdd) {
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
            var last_maint_date = maintenanceList[maint_index].last_maintenance_val.getTime();
            var activity_date_dataset = [0];
            var date_print_list = [maintenanceList[maint_index].last_maintenance_val];
            var activity_distance_dataset = [0];
            var activity_index;
            for (activity_index = 0; activity_index < activityList.length; activity_index++) {
                activity_date_dataset.push((activityList[activity_index].date.getTime() - last_maint_date)/millisecondsInADay);
                activity_distance_dataset.push(activityList[activity_index].distance + activity_distance_dataset[activity_index]);

                date_print_list.push(activityList[activity_index].date);
            }
            console.log(activity_date_dataset);
            console.log(activity_distance_dataset);

            var mean_x = mean(activity_date_dataset);
            var mean_y = mean(activity_distance_dataset);
            var variance_x = variance(activity_date_dataset, mean_x);
            var covar = covariance(activity_date_dataset, mean_x, activity_distance_dataset, mean_y);
            var slope = predictSlope(covar, variance_x);
            var intercept = predictIntercept(mean_x, mean_y, slope);
            console.log("Description of Maintenance:" + maintenanceList[maint_index].description);
            console.log("Predicted slope:" + slope);
            console.log("Predicted intercept:" + intercept);
            var predict_date = ((maintenanceList[maint_index].threshold_val - intercept) / slope)
            var final_date = addDays(maintenanceList[maint_index].last_maintenance_val, predict_date);
            console.log("Your last maintenance: " + maintenanceList[maint_index].last_maintenance_val);
            console.log("Your component threshold value: " + maintenanceList[maint_index].threshold_val);
            console.log("Your Activity (in km): " + '\n'
                        + date_print_list[0] + ":" + activity_distance_dataset[0] + '\n'
                        + date_print_list[1] + ":" + activity_distance_dataset[1] + '\n'
                        + date_print_list[2] + ":" + activity_distance_dataset[2] + '\n'
                        + date_print_list[3] + ":" + activity_distance_dataset[3] + '\n'
                        + date_print_list[4] + ":" + activity_distance_dataset[4]);
            console.log("Your next estimated maintenance date:" + final_date);

            final_date = moment(final_date, 'YYYY-MM-DD').tz("America/Los_Angeles").format('l');
            predict_dates.push(final_date);
			predictionText += maintenanceList[maint_index].description + ' estimated due on: ' + final_date + '\n';
			console.log('dates: ' + predict_dates);
        }
		
		deviceTokens.forEach(t => {
			console.log('', t);
			setTimeout(function(){
				notificationService.SendNotification(notificationService.CreateMessage(
				'Maintenance Schedule Prediction',
				'Upcoming Maintenance Predictions',
				predictionText,
				{},
				t.token))
			}, 8000);		
		});
		

        return predict_dates;
    }

    /*
     * Uses linear regression formula to predict slope https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
     * input:
     * 	covariance - covariance of x and y values
     * 	x_variance - variance of x values
     * output:
     * 	slope predicted with linear regression formula
     * 	null if x_variance is 0
     */
    function predictSlope(covariance, x_variance) {
      //denominator check
      if (x_variance === 0) {
        return null;
      }
      return covariance / x_variance;
    }

    /*
     * Uses linear regression formula to predict intercept https://machinelearningmastery.com/implement-simple-linear-regression-scratch-python/
     * input:
     * 	x_mean - mean of x values
     * 	y_mean - mean of y values
     * 	slope - predicted or actual slope of x, y values
     * output:
     * 	intercept predicted with linear regression formula
     */
    function predictIntercept(x_mean, y_mean, slope) {
      return y_mean - slope * x_mean;
    }

    /*
     * Adds a given number of days to current date time
     * input:
     * 	curr_date - date time of the original date
     * 	days_to_add - (int, double, float) number of days to add
     * output:
     * 	date time of curr_date advanced by days_to_add
     */
    function addDays(curr_date, days_to_add) {
      var final_date = new Date(curr_date);
      final_date.setDate(final_date.getDate() + days_to_add);
      return final_date;
    }

    //Retrieve maintenance item and activity from database. Estimates next maintenance date
    //Linear regression performed on x -> activity date and y -> activity distance
    var predict_dates = [];
    var predictionText = '';

    var maint_index;
    for (maint_index = 0; maint_index < maintenanceList.length; maint_index++) {
      var last_maint_date = maintenanceList[
        maint_index
      ].last_maintenance_val.getTime();
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
        activity_distance_dataset.push(
          activityList[activity_index].distance +
            activity_distance_dataset[activity_index],
        );
      }

      //Intermediate calculations for linear regression
      var x_mean = mean(activity_date_dataset);
      var y_mean = mean(activity_distance_dataset);
      if (x_mean == null || y_mean == null) {
        //handle null error
        predict_dates.push(null);
        prectionText += 'error calculating' + '\n';
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
        prectionText += 'error calculating' + '\n';
        break;
      }

      var slope = predictSlope(covar_sum, x_variance);
      var intercept = predictIntercept(x_mean, y_mean, slope);

      var predict_days_in_advance =
        (maintenanceList[maint_index].threshold_val - intercept) / slope;
      var final_date = addDays(
        maintenanceList[maint_index].last_maintenance_val,
        predict_days_in_advance,
      );

      //round predicted datetime to closests date
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
      setTimeout(function () {
        notificationService.SendNotification(
          notificationService.CreateMessage(
            'Maintenance Schedule Prediction',
            'Upcoming Maintenance Predictions',
            predictionText,
            {},
            t._id,
          ),
        );
      }, 8000);
    });

    return predict_dates;
  }
}

const maintenanceScheduleService = new MaintenanceScheduleService(
  notificationService,
);
module.exports = maintenanceScheduleService;
