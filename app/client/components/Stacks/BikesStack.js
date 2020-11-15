import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

import BikesScreen from '../Screens/BikesScreen';
import ComponentsScreen from '../SubScreens/ComponentsScreen';
import ComponentTaskScreen from '../SubScreens/ComponentTaskScreen';
import AddTaskScreen from '../SubScreens/AddTaskScreen';

export default class BikesStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Bikes" component={BikesScreen} />
        <Stack.Screen name="Components" component={ComponentsScreen} />
        <Stack.Screen
          name="ComponentTaskScreen"
          component={ComponentTaskScreen}
        />
        <Stack.Screen name="AddTaskScreen" component={AddTaskScreen} />
      </Stack.Navigator>
    );
  }
}
