const notificationService = require('./NotificationService');
const moment = require('moment');
require('moment-timezone');

class MaintenanceScheduleService{

	constructor(notificationService){
		this.notificationService = notificationService;
	}

	MaintenancePredict(deviceTokens) {
		
		//placeholder database data
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


		/*
		* Calculates the mean of an array of values
		* input:
		* 	vals - array of values (int, double, float)
		* output: 
		* 	mean value of the array
		*	null if vals array is invalid
		*/
		function mean(vals) {
			//error check for array length
			if (vals.length <= 0) {
				return null;
			}

		    var sum_vals = vals.reduce(function(accumulator, curr_val){
		        return accumulator + curr_val;
			}, 0);
			
		    return sum_vals / vals.length;
		}
		
		/*
		* Calculates the variance of an array of values given the mean of the array
		* input:
		* 	vals - array of values (int, double, float)
		* 	mean - mean value of vals array
		* output:
		* 	variance value of the array
		* 	null if vals array is invalid
		*/
		function variance(vals, mean) {
			//error check for array length
			if (vals.length <= 0) {
				return null;
			}

		    var sum_variance = vals.reduce(function(accumulator, curr_val){
		        return accumulator + Math.pow(curr_val - mean, 2);
			}, 0);
			
		    return sum_variance;
		}
		
		/*
		* Calculates the covariance between two array of values, given each array's mean
		* input:
		* 	x_vals - first array of values (int, double, float)
		* 	x_mean - mean value of first array
		* 	y_vals - second array of values (int, double, float)
		* 	y_mean - mean value of second array
		* output:
		* 	covariance between x_vals and y_vals
		* 	null if arrays are invalid
		*/
		function covariance(x_vals, x_mean, y_vals, y_mean) {
			//error check for differing data set lengths
		    if (x_vals.length != y_vals.length) {
		        return null;
			}
			//error check for array length
			else if (x_vals.length <= 0 || y_vals.length <= 0) {
				return null;
			}
		    var covariance = 0.0;
		    var i;
		    for (i = 0; i < x_vals.length; i++) {
		        covariance += (x_vals[i] - x_mean)  * (y_vals[i] - y_mean)
		    }
		    return covariance;
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
			if (x_variance == 0) {
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
		function addDays (curr_date, days_to_add) {
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
            var last_maint_date = maintenanceList[maint_index].last_maintenance_val.getTime();
            var activity_date_dataset = [0];
			var activity_distance_dataset = [0];
			
            var activity_index;
            for (activity_index = 0; activity_index < activityList.length; activity_index++) {
                activity_date_dataset.push((activityList[activity_index].date.getTime() - last_maint_date)/millisecondsInADay);
                activity_distance_dataset.push(activityList[activity_index].distance + activity_distance_dataset[activity_index]);
            }

			//Intermediate calculations for linear regression
            var x_mean = mean(activity_date_dataset);
            var y_mean = mean(activity_distance_dataset);
            var x_variance = variance(activity_date_dataset, x_mean);
            var covar = covariance(activity_date_dataset, x_mean, activity_distance_dataset, y_mean);
            var slope = predictSlope(covar, x_variance);
            var intercept = predictIntercept(x_mean, y_mean, slope);

            var predict_days_in_advance = ((maintenanceList[maint_index].threshold_val - intercept) / slope)
            var final_date = addDays(maintenanceList[maint_index].last_maintenance_val, predict_days_in_advance);

			//round predicted datetime to closests date
            final_date = moment(final_date, 'YYYY-MM-DD').tz("America/Los_Angeles").format('l');
            predict_dates.push(final_date);
			predictionText += maintenanceList[maint_index].description + ' estimated due on: ' + final_date + '\n';
        }
		
		deviceTokens.forEach(t => {
			setTimeout(function(){
				notificationService.SendNotification(notificationService.CreateMessage(
				'Maintenance Schedule Prediction',
				'Upcoming Maintenance Predictions',
				predictionText,
				{},
				t._id))
			}, 8000);		
		});
		

        return predict_dates;
    }
}

const maintenanceScheduleService = new MaintenanceScheduleService(notificationService);
module.exports = maintenanceScheduleService;