import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {WebView} from 'react-native-webview';

const AUTH_URI =
  'https://www.strava.com/oauth/mobile/authorize?client_id=55933&redirect_uri=http://3.97.53.16:5000/stravaRedirect&response_type=code&approval_prompt=force&scope=read,read_all,profile:read_all,activity:read_all';

export default class StravaAuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  render() {
    return (
        <WebView
          ref={(ref) => {
            this.webView = ref;
          }}
          source={{uri: AUTH_URI}}
          onNavigationStateChange={this._onNavigationStateChange.bind(this)}
        />
    );
  }

  _onNavigationStateChange(webViewState) {
    // TODO: Bring in content from App.js state
  }
}
