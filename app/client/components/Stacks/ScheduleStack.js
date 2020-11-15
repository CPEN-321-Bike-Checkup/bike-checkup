import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import ScheduleScreen from '../Screens/ScheduleScreen';

export default class ScheduleStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Maintenance Schedule" component={ScheduleScreen} />
      </Stack.Navigator>
    );
  }
}
