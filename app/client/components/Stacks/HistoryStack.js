import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HistoryScreen from '../Screens/HistoryScreen';

const Stack = createStackNavigator();

export default class HistoryStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Maintenance Log" component={HistoryScreen} />
      </Stack.Navigator>
    );
  }
}
