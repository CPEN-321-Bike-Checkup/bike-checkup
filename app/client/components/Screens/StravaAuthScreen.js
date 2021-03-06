import React from 'react';
import {WebView} from 'react-native-webview';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import Keys from './../../keys.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Strava authentication constants
const AUTH_URI =
  'https://www.strava.com/oauth/mobile/authorize?client_id=55933&redirect_uri=http://3.97.53.16:5000/stravaRedirect&response_type=code&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all';
const CODE_LABEL_LENGTH = 5;
const PARAM_SEPARATOR_LENGTH = 1;

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log('Saved ' + key + ': ', value);
  } catch (e) {
    console.error('Failed to save data to storage: ', key, val);
  }
};

export default class StravaAuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    this.state = {
      authSent: false,
    };
  }

  render() {
    return (
      <WebView
        ref={(ref) => {
          this.webView = ref;
        }}
        cacheMode={'LOAD_NO_CACHE'}
        cacheEnabled={false}
        incognito={true}
        source={{uri: AUTH_URI}}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      />
    );
  }

  _onNavigationStateChange(webViewState) {
    if (!webViewState.loading) {
      if (webViewState.url.includes('code=') && this.state.authSent === false) {
        var startIndex = webViewState.url.indexOf('code=') + CODE_LABEL_LENGTH; // To get past 'code=' to the actual code
        var endIndex =
          webViewState.url.indexOf('scope=') - PARAM_SEPARATOR_LENGTH;
        var authCode = webViewState.url.substring(startIndex, endIndex);

        const FINAL_AUTH_POST_REQ =
          'https://www.strava.com/oauth/token?client_id=55933&client_secret=' +
          Keys['strava-client-secret'] +
          '&code=' +
          authCode +
          '&grant_type=authorization_code';

        axios.post(FINAL_AUTH_POST_REQ).then(
          (response) => {
            var athleteData = response.data.athlete;

            console.log('Athlete data: ', response.data.athlete);
            console.log('Strava access token: ', response.data.access_token);
            // TODO: uncomment when done local testing
            // global.userId = athleteData.id; // Save athlete id with global access
            axios
              .post(
                'http://' +
                  global.serverIp +
                  ':5000/strava/' +
                  athleteData.id +
                  '/connectedStrava',
                {
                  _id: athleteData.id,
                  name: athleteData.firstname + ' ' + athleteData.lastname,
                  strava_token: response.data.access_token,
                  refresh_token: response.data.refresh_token,
                  expires_in: response.data.expires_in,
                },
              )
              .then((resp) => {
                global.userId = athleteData.id;
                this.setState((stateOld) => {
                  return {authSent: true};
                });
                console.log('Set global user id', global.userId);
                // Now that initial authentication flow is complete, navigate to main Home Navigator
                this.navigation.replace('Home');

                storeData('userId', {userId: athleteData.id.toString()});
                console.log('Successfully sent user tokens');
                PushNotification.configure({
                  onRegister: (tokenData) => {
                    console.log('Remote notification token: ', tokenData);
                    axios
                      .post(
                        'http://' +
                          global.serverIp +
                          ':5000/user/registerDevice',
                        {
                          userId: athleteData.id,
                          token: tokenData.token,
                        },
                      )
                      .then((res) => {
                        console.log('Registered device');
                      })
                      .catch((err) => {
                        console.log('Failed to register device: ', err);
                      });
                  },

                  onNotification: (notification) => {
                    console.log('Remote notification received: ', notification);
                  },
                  senderID: global.senderID,
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
