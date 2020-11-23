import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import ScheduleScreen from '../Screens/ScheduleScreen';
import AddTaskScreen from '../SubScreens/AddTaskScreen';

export default class ScheduleStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Maintenance Schedule"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Maintenance Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
      </Stack.Navigator>
    );
  }
}
