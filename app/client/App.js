import {React, Component} from 'react';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import NavigationContainer from '@react-navigation/native';
import createMaterialBottomTabNavigator from '@react-navigation/material-bottom-tabs';
import StyleSheet from 'react-native';
import Colors from 'react-native/Libraries/NewAppScreen';

import ActivitiesScreen from './components/Screens/ActivitiesScreen';
import MaintenanceScreen from './components/MaintenancePrediction';
import ScheduleScreen from './components/Screens/ScheduleScreen';
import HistoryScreen from './components/Screens/HistoryScreen';
import BikesStack from './components/BikesStack';

// Dev debug flags
const SKIP_AUTHENTICATION = true; // Set to false before committing to prod!

const Tab = createMaterialBottomTabNavigator();

// Strava authentication constants
const AUTH_URI =
  'https://www.strava.com/oauth/mobile/authorize?client_id=55294&redirect_uri=http://3.97.53.16:5000/stravaRedirect&response_type=code&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all';
const CODE_LABEL_LENGTH = 5;
const PARAM_SEPARATOR_LENGTH = 1;

// Push notification configuration
var serverIp = '3.97.53.16';
PushNotification.configure({
  onRegister: (tokenData) => {
    console.log('Remote Notification Token: ', tokenData);
    axios
      .post('http://' + serverIp + ':5000/user/registerDevice', {
        userId: 1,
        token: tokenData.token,
      })
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
  senderID: 517168871348,
  popInitialNotification: false,
  requestPermissions: true,
});

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
              component={ScheduleScreen}
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
              component={HistoryScreen}
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
              component={ActivitiesScreen}
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
            <Tab.Screen
              name="Maintenance"
              component={MaintenanceScreen}
              options={{
                tabBarColor: 'green',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="wrench"
                    color={color}
                    size={24}
                  />
                ),
                tabBarTestID: 'MaintenanceTab',
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
          'https://www.strava.com/oauth/token?client_id=55294&client_secret=d4199150472e3cd7520e12e203c69dd345b4da0a&code=' +
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
            console.log('Athlete data: ', response.data.athlete);
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
