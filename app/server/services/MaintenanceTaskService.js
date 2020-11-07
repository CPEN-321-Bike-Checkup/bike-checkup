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
}

const maintenanceScheduleService = new MaintenanceScheduleService(notificationService);
module.exports = maintenanceScheduleService;