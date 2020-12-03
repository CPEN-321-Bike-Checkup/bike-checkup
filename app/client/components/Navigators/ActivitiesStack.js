import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ActivitiesScreen from '../Screens/ActivitiesScreen';
import {Colors} from './../../constants/Colors'

const Stack = createStackNavigator();

export default class ActivitiesStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'black',
          headerStyle: {backgroundColor: Colors.primaryOrange},
        }}>
        <Stack.Screen name="Activities" component={ActivitiesScreen} />
      </Stack.Navigator>
    );
  }
}
