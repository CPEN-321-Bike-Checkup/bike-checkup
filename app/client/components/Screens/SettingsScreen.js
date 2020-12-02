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

  onPopupClose = () => {
    // Clear error state
    this.setState({
      syncCompletePopupVisible: false,
    });
  };

  getUserName() {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/user/${global.userId}`, { method: 'GET'})
        .then((response) => {
          console.log(response)
          response.json();
        })
        .then((data) => {
          this.setState(() => {
            console.log(data)
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
        <View style={styles.lineBreak}></View>
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
        {Popup(
          'Strava Sync Successful',
          this.onPopupClose,
          this.state.syncCompletePopupVisible,
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
