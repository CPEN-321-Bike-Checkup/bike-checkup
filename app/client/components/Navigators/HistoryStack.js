import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import HistoryScreen from '../Screens/HistoryScreen';
import {Colors} from './../../constants/Colors'

const Stack = createStackNavigator();

export default class HistoryStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName='Maintenance History'
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: Colors.primaryOrange},
        }}>
        <Stack.Screen name='Maintenance History' component={HistoryScreen} />
      </Stack.Navigator>
    );
  }
}
