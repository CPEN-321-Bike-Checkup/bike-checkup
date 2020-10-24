import React, { Component } from 'react';
import { Text, Button, View } from 'react-native'

const maintSchedule1 = {
    maintenance_id: 1,
    component_id: 1,
    schedule_type: "maintenance",
    threshold_val: 100,
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
}

const activity2 = {
    activity_id: 2,
    distance: 30,
    date: new Date('2020-10-22')
}

const activity3 = {
    activity_id: 3,
    distance: 50,
    date: new Date('2020-10-22')
}

const activity4 = {
    activity_id: 4,
    distance: 60,
    date: new Date('2020-10-25')
}

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

export default class MaintenancePrediction extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            time: ''
        };
    }



    maintenancePredict() {
        //get JSON data from Strava call
        //normalize units if necessary -> convert-units or just mile->km manual conversion
        var test_vals = [1, 2, 3, 4, 5];
        var test_vals_y = [2, 4, 6, 8, 10];
        var test_mean = mean(test_vals);
        var test_mean_y = mean(test_vals_y);
        var test_variance = variance(test_vals, test_mean);
        var test_covariance = covariance(test_vals, test_mean, test_vals_y, test_mean_y);

        var b1 = test_covariance / test_variance;
        var b0 = test_mean_y - b1 * test_mean;

        console.log('x vals are: ', test_vals);
        console.log('y vals are: ', test_vals_y);
        console.log('x mean is: ', test_mean);
        console.log('y mean is: ', test_mean_y);
        console.log('x variance is: ', test_variance);
        console.log('covariance is: ', test_covariance);
        console.log('b1 is: ', b1);
        console.log('b0 is: ', b0);
    }

    render(){
        return(
            <>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 50}}>
                    <Button
                        title="Predict!"
                        onPress={() => this.maintenancePredict()}
                    />
                    <Text>Please check console</Text>
                </View>
            </>
        );
    }
}