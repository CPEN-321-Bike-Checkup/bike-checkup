import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

import BikesScreen from './BikesScreen';
import ComponentsScreen from './BikesSubScreens/ComponentsScreen';
import ComponentScheduleScreen from './BikesSubScreens/ComponentScheduleScreen';

export default class ScheduleScreen extends React.Component {

  render() {
    return(
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: { backgroundColor: 'tomato' },
        }}
      >
        <Stack.Screen name="Bikes" component={BikesScreen} />
        <Stack.Screen name="Components" component={ComponentsScreen} />
        <Stack.Screen name="ComponentSchedule" component={ComponentScheduleScreen} />
      </Stack.Navigator>
    );
  }
}
