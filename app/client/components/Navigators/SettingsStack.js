import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import SettingsScreen from '../Screens/SettingsScreen';
import {Colors} from './../../constants/Colors'

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
          headerTintColor: 'black',
          headerStyle: {backgroundColor: Colors.primaryOrange},
        }}>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    );
  }
}
