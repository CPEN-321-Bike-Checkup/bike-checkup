import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import axios from 'axios';
import moment from 'moment';
require('moment-timezone');







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




export default class MaintenancePrediction extends React.Component{

    constructor(props){
        super(props);

		this.state = {
           		time: '',
           		predict_dates: [],
           		maintenance_schedules: []
        };
				
	}
	

	componentDidMount(){
		this.maintenancePredict();
	}
	

	


	maintenancePredict(){
		var serverIp = '3.97.53.16';
		axios.get("http://" + serverIp + ":5000/maintenanceTask/prediction")
		.then((res) => {
                console.log("Got Predictions");
				var dates = res.data.dates;
				console.log('dates; ', dates);
				this.setState({predict_dates: dates});
		})
            .catch((err) => {
                console.log("Failed to get predictions: ", err);
            });



		//fetch("http://" + serverIp + ":5000/maintenanceSchedule/prediction") 
		//.then((res) => {
        //        console.log("Got Predictions");
		//		var dates = res.dates;
		//		console.log('dates; ', dates);
		//		this.setState({predict_dates: dates});
		//})
        //    .catch((err) => {
        //        console.log("Failed to get predictions: ", err);
        //    });
		
		
	}
    

    render(){

			console.log('state: ', this.state);
		if (this.state.predict_dates.length > 0){
        	this.state.maintenance_schedules = maintenanceList;
        	var maintenance_predictions = [];
        	for (let maint_index = 0; maint_index < maintenanceList.length; maint_index++) {

        	    var predict_date_key = this.state.predict_dates[maint_index].toString();
        	    var maint_description = this.state.maintenance_schedules[maint_index].description;
        	    var maint_last_maint_date = moment(this.state.maintenance_schedules[maint_index].last_maintenance_val, 'YYYY-MM-DD').tz("America/Los_Angeles").format('l');
        	    var component_threshold = this.state.maintenance_schedules[maint_index].threshold_val;
        	    maintenance_predictions.push(
        	    <View key={maint_index}>
        	        <Text style = {{textAlignVertical: "center", textAlign: "center", fontWeight:"bold"}}>{maint_description}{'\n'}</Text>
        	        <Text>
        	              Previous Maintenance Date: {maint_last_maint_date}{'\n'}
        	              Threshold: {component_threshold}km{'\n'}{'\n'}

        	              Estimated Maintenance Date: {predict_date_key}</Text>
        	    </View>
        	    );
        	    console.log(maintenance_predictions);
        	}
		}
        return(
            <>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 50}}>
                    {maintenance_predictions}
                    <Button
                        title="Predict!"
                        onPress={() => this.maintenancePredict()}
                    />

                </View>
            </>
        );
    }
}