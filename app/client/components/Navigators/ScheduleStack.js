import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ScheduleScreen from '../Screens/ScheduleScreen';
import AddTaskScreen from '../SubScreens/AddTaskScreen';
import {Colors} from './../../constants/Colors'

const Stack = createStackNavigator();

export default class ScheduleStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Maintenance Schedule"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryOrange},
        }}>
        <Stack.Screen name="Maintenance Schedule" component={ScheduleScreen} />
        <Stack.Screen name="Add Task" component={AddTaskScreen} />
      </Stack.Navigator>
    );
  }
}
