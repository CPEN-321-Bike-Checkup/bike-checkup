import React, {Component} from 'react';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {WebView} from 'react-native-webview';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import BikesStack from './components/Stacks/BikesStack';
import ScheduleStack from './components/Stacks/ScheduleStack';
import HistoryStack from './components/Stacks/HistoryStack';
import ActivitiesStack from './components/Stacks/ActivitiesStack';
import Keys from './keys.json';

// Dev debug flags
const SKIP_AUTHENTICATION = false; // Set to false before committing!

const Tab = createMaterialBottomTabNavigator();

// Strava authentication constants
const AUTH_URI =
  'https://www.strava.com/oauth/mobile/authorize?client_id=55933&redirect_uri=http://3.97.53.16:5000/stravaRedirect&response_type=code&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all';
const CODE_LABEL_LENGTH = 5;
const PARAM_SEPARATOR_LENGTH = 1;

// Push notification configuration
// const serverIp = '3.97.53.16'; // Server IP
const serverIp = '10.244.31.128'; // Amanda's local IP (ShawOpen, ubcsecure doesn't work)
// const serverIp = '192.168.1.11'; // Connor's local IP
// const serverIp = '192.168.1.83';  // Brennan's local IP
const senderID = 517168871348;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authCodeRetrieved: SKIP_AUTHENTICATION,

      // Strava post-authentication important values
      accessToken: '',
      expiresAt: '',
      refreshToken: '',
      athleteData: '', // In JSON form
    };

    // Set global variables
    global.serverIp = serverIp;
    global.userId = 71747974; // TODO: set to actual ID fetched during login
  }

  render() {
    return (
      // Post-authentication state:
      (this.state.authCodeRetrieved && (
        <NavigationContainer>
          <Tab.Navigator
            initialRouteName="Schedule"
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            labelStyle={{fontSize: 12}}
            barStyle={{backgroundColor: 'tomato'}}
            labeled={true}
            shifting={false}
            options={{
              tabBarTestID: 'BottomTabNavigator',
            }}>
            <Tab.Screen
              name="Schedule"
              component={ScheduleStack}
              options={{
                tabBarColor: '#694fad',
                tabBarIcon: ({color}) => (
                  <MaterialIcons name="schedule" color={color} size={26} />
                ),
                tabBarTestID: 'ScheduleTab',
              }}
            />
            <Tab.Screen
              name="History"
              component={HistoryStack}
              options={{
                tabBarColor: 'blue',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="history"
                    color={color}
                    size={26}
                  />
                ),
                tabBarTestID: 'HistoryTab',
              }}
            />
            <Tab.Screen
              name="BikeStack"
              component={BikesStack}
              options={{
                title: 'Bikes',
                tabBarColor: 'red',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons name="bike" color={color} size={24} />
                ),
                tabBarTestID: 'BikesTab',
              }}
            />
            <Tab.Screen
              name="Activities"
              component={ActivitiesStack}
              options={{
                tabBarColor: 'green',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="bike-fast"
                    color={color}
                    size={24}
                  />
                ),
                tabBarTestID: 'ActivitiesTab',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      )) ||
      // Intial authentication state:
      (!this.state.authCodeRetrieved && (
        <WebView
          ref={(ref) => {
            this.webView = ref;
          }}
          source={{uri: AUTH_URI}}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
      ))
    );
  }

  _onNavigationStateChange(webViewState) {
    if (!webViewState.loading) {
      if (webViewState.url.includes('code=')) {
        var startIndex = webViewState.url.indexOf('code=') + CODE_LABEL_LENGTH; // To get past 'code=' to the actual code
        var endIndex =
          webViewState.url.indexOf('scope=') - PARAM_SEPARATOR_LENGTH;
        var authCode = webViewState.url.substring(startIndex, endIndex);
        this.setState({
          authCodeRetrieved: true,
        });

        const FINAL_AUTH_POST_REQ =
          'https://www.strava.com/oauth/token?client_id=55933&client_secret=' +
          Keys['strava-client-secret'] +
          '&code=' +
          authCode +
          '&grant_type=authorization_code';

        axios.post(FINAL_AUTH_POST_REQ).then(
          (response) => {
            this.setState({
              accessToken: response.data.access_token,
              expiresAt: response.data.expires_at,
              refreshToken: response.data.refresh_token,
              athleteData: response.data.athlete,
            });
            var athlete = response.data.athlete;
            console.log('Athlete data: ', response.data.athlete);
            console.log('strava access token', response.data.access_token);
            // TODO: uncomment when done local testing
            // global.userId = athlete.id; // Save athlete id with global access
            axios
              .post(
                'http://' +
                  serverIp +
                  ':5000/strava/' +
                  athlete.id +
                  '/connectedStrava',
                {
                  _id: athlete.id,
                  name: athlete.firstname + ' ' + athlete.lastname,
                  strava_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                  expires_in: response.data.expires_in,
                },
              )
              .then((resp) => {
                console.log('Successfully sent user tokens');
                PushNotification.configure({
                  onRegister: (tokenData) => {
                    console.log('Remote Notification Token: ', tokenData);
                    axios
                      .post(
                        'http://' + serverIp + ':5000/user/registerDevice',
                        {
                          userId: athlete.id,
                          token: tokenData.token,
                        },
                      )
                      .then((res) => {
                        console.log('Registered Device');
                      })
                      .catch((err) => {
                        console.log('Failed to register device: ', err);
                      });
                  },

                  onNotification: (notification) => {
                    console.log('Remote Notification Received: ', notification);
                  },
                  senderID: senderID,
                  popInitialNotification: false,
                  requestPermissions: true,
                });
              });
          },
          (error) => {
            console.log(error);
          },
        );
      }
    }
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
