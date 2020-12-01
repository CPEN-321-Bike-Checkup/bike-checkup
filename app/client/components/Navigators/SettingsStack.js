import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../Screens/SettingsScreen';

const Stack = createStackNavigator();
export default class SettingsStack extends React.Component {
  // TODO: Fetch login token here and only render Welcome + Auth screens
  //
  // If not already logged in
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Settings"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Setting" component={SettingsScreen} />
      </Stack.Navigator>
    );
  }
}
