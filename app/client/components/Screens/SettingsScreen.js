import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {View, Text, Button, StyleSheet} from 'react-native';
import {Colors} from './../../constants/Colors';
import {timeout} from '../ScreenUtils';
import Popup from '../SubComponents/Popup'

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
      settingsTitle: null,
      syncCompletePopupVisible: false,
      weeklySummaryPopupVisible: false,
    };

    this.navigation = props.navigation;
  };

  componentDidMount() {
    this.getUserName();
  };

  logout() {
    removeValue('userId');
    this.navigation.replace('Welcome');
  };

  syncStravaData() {
    global.SyncStrava(global.userId).then((result) => {
      //when sync is done
      this.setState({
        syncCompletePopupVisible: true,
      })
    });
  };

  triggerPushNotification() {
    this.setState({
      weeklySummaryPopupVisible: true,
    });

    setTimeout(() => {
        timeout(3000, fetch(`http://${global.serverIp}:5000/runReminderJob`, { method: 'POST'}))
        .catch((error) => {
          console.error(error);
        });
      }, 10000);
  };

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
  }

  getUserName() {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/user/${global.userId}`, { method: 'GET'})
        .then((response) => {
          response.json();
        })
        .then((data) => {
          this.setState(() => {
            return {
              settingsTitle: data ? data + 's Settings' : 'Settings', // TODO: Figure out why data is undefined
            };
          });
        }),
    ).catch((error) => {
      // Gracefully handle error by displaying generic settings title
      this.setState(() => {
        return {
          settingsTitle: 'Settings',
        };
      });

      console.error(error);
    });
  };

  render() {
    return (
      <View style={styles.view}>
        <Text style={styles.title}>{this.state.settingsTitle}</Text>
        <Button
          title="Sync Strava Data"
          color={Colors.primaryOrange}
          onPress={() => this.syncStravaData()}
        />
        <View style={styles.lineBreak}></View>
        <Button
          title="Logout"
          color={Colors.primaryOrange}
          onPress={() => this.logout()}
        />
        <View style={styles.lineBreak}></View>
        <Button
          title="Get Weekly Summary Push Notification"
          color={Colors.primaryOrange}
          onPress={() => this.triggerPushNotification()}
        />
        {Popup(
          'Strava Sync Successful',
          this.onStravaSyncPopupClose,
          this.state.syncCompletePopupVisible,
          false
        )}
        {Popup(
          'Your notification will appear in 10 seconds. Please close the app to see the notification.',
          this.onWeeklySummaryPopupClose,
          this.state.weeklySummaryPopupVisible,
          false
        )}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 70,
    paddingBottom: 150,
    fontFamily: 'notoserif',
  },
  lineBreak: {
    padding: 20,
  },
});
