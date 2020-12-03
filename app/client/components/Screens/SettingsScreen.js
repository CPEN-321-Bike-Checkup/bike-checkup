import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from './../../constants/Colors';
import {timeout} from '../ScreenUtils';
import Popup from '../SubComponents/Popup';

removeValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      syncCompletePopupVisible: false,
      weeklySummaryPopupVisible: false,
    };

    this.navigation = props.navigation;
  }

  logout() {
    removeValue('userId');
    this.navigation.replace('Welcome');
  }

  syncStravaData() {
    global.SyncStrava(global.userId).then((result) => {
      //when sync is done
      this.setState({
        syncCompletePopupVisible: true,
      });
    });
  }

  triggerPushNotification() {
    this.setState({
      weeklySummaryPopupVisible: true,
    });

    setTimeout(() => {
      timeout(
        3000,
        fetch(`http://${global.serverIp}:5000/runReminderJob`, {
          method: 'POST',
        }),
      ).catch((error) => {
        console.error(error);
      });
    }, 10000);
  }
 
  onStravaSyncPopupClose = () => {
    // Clear popup
    this.setState({
      syncCompletePopupVisible: false,
    });
  };

  onWeeklySummaryPopupClose = () => {
    // Clear popup
    this.setState({
      weeklySummaryPopupVisible: false,
    });
  };

  render() {
    return (
      <View style={styles.view}>
        <View style={styles.largeLineBreak}></View>
        <TouchableOpacity onPress={() => this.syncStravaData()}>
          <Text style={styles.button}>SYNC STRAVA DATA</Text>
        </TouchableOpacity>
        <View style={styles.lineBreak}></View>
        <TouchableOpacity onPress={() => this.logout()}>
          <Text style={styles.button}>LOGOUT</Text>
        </TouchableOpacity>
        <View style={styles.lineBreak}></View>
        <TouchableOpacity onPress={() => this.triggerPushNotification()}>
          <Text style={styles.button}>GET WEEKLY SUMMARY PUSH NOTIFICATION</Text>
        </TouchableOpacity>
        {Popup(
          'Strava Sync Successful',
          this.onStravaSyncPopupClose,
          this.state.syncCompletePopupVisible,
          false,
        )}
        {Popup(
          'Your notification will appear in 10 seconds. Please close the app to see the notification.',
          this.onWeeklySummaryPopupClose,
          this.state.weeklySummaryPopupVisible,
          false,
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineBreak: {
    padding: 20,
  },
  largeLineBreak: {
    padding: 100,
  },
  button: {
    backgroundColor: Colors.accentBlue,
    padding: 10,
    fontFamily: 'notoserif',
    fontWeight: 'bold',
  },
});
