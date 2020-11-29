import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ActivitiesScreen from '../Screens/ActivitiesScreen';

const Stack = createStackNavigator();

export default class ActivitiesStack extends React.Component {
  render() {
    return (
      <Stack.Navigator
        initialRouteName="Bikes"
        screenOptions={{
          headerTintColor: 'white',
          headerStyle: {backgroundColor: 'tomato'},
        }}>
        <Stack.Screen name="Activities" component={ActivitiesScreen} />
      </Stack.Navigator>
    );
  }
}
