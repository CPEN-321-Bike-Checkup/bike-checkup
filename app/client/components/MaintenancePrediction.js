import React from 'react';
import {Text, Button, View, StyleSheet} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';

/* Placeholder Maintenance Schedule Data */
const maintSchedule1 = {
  maintenanceId: 1,
  componentId: 1,
  thresholdValue: 450,
  description: 'oil chain',
  prevMaintenanceDate: new Date('2020-10-20'),
};

const maintSchedule2 = {
  maintenanceId: 2,
  componentId: 3,
  thresholdValue: 180,
  description: 'tire check',
  prevMaintenanceDate: new Date('2020-10-23'),
};

let maintenanceList = [maintSchedule1, maintSchedule2];

export default class MaintenancePrediction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      time: '',
      predictedDates: [],
    };
  }

  componentDidMount() {
    this.getMaintenancePredictions();
  }

  getMaintenancePredictions() {
    /* Fetch predictions from server */
    var serverIp = '3.97.53.16';
    axios
      .get('http://' + serverIp + ':5000/maintenanceTask/prediction')
      .then((res) => {
        var dates = res.data.dates;
        console.log('INFO: Successfully fetched predictions: ' + dates);

        this.setState({predictedDates: dates});
      })
      .catch((err) => {
        console.log('ERRROR: Failed to fetch predictions: ', err);
      });
  }

  getAllMaintenanceTasks() {
    /* Fetch predictions from server */
    var serverIp = '3.97.53.16';
    axios
      .get('http://' + serverIp + ':5000/maintenanceTask/tasks')
      .then((res) => {
        var dates = res.data.dates;
        console.log('INFO: Successfully fetched tasks: ' + dates);

        //this.setState({predictedDates: dates});
      })
      .catch((err) => {
        console.log('ERRROR: Failed to fetch tasks: ', err);
      });
  }

  render() {
    if (this.state.predictedDates.length > 0) {
      var maintenancePredictions = [];

      for (
        let maintIndex = 0;
        maintIndex < maintenanceList.length;
        maintIndex++
      ) {
        if (this.state.predictedDates[maintIndex] == null) {
          var predictedMaintDate = 'No predictions available';
        } else {
          var predictedMaintDate = this.state.predictedDates[
            maintIndex
          ].toString();
        }

        var maintDescription = maintenanceList[maintIndex].description;

        var prevMaintDate = moment(
          maintenanceList[maintIndex].prevMaintenanceDate,
          'YYYY-MM-DD',
        )
          .tz('America/Los_Angeles')
          .format('l');

        var maintthresholdValue = maintenanceList[maintIndex].thresholdValue;

        maintenancePredictions.push(
          <View key={maintIndex}>
            <Text style={styles.maintDescription}>
              {maintDescription}
              {'\n'}
            </Text>
            <Text>
              Previous Maintenance Date: {prevMaintDate}
              {'\n'}
              thresholdValue: {maintthresholdValue}km{'\n'}
              {'\n'}
              Estimated Maintenance Date: {predictedMaintDate}
            </Text>
          </View>,
        );
      }
    }
    return (
      <View style={styles.container}>
        {maintenancePredictions}
        <Button
          title="Predict!"
          onPress={() => this.getMaintenancePredictions()}
        />
        <Button title="Show!" onPress={() => this.getAllMaintenanceTasks()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 50,
  },
  maintDescription: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
