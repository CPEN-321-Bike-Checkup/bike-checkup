import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from '../Screens/WelcomeScreen';
import StravaAuthScreen from '../Screens/StravaAuthScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();
export default class LoginStack extends React.Component {
  // TODO: Fetch login token here and only render Welcome + Auth screens
  //
  // If not already logged in
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}>
          {/* <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen
            name="Strava Authentication"
            component={StravaAuthScreen}
          /> */}
          <Stack.Screen name="Home" component={MainTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
