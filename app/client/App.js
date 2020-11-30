import React, {Component} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {NavigationContainer} from '@react-navigation/native';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import WelcomeScreen from './components/Screens/WelcomeScreen';
import StravaAuthScreen from './components/Screens/StravaAuthScreen';
import BikesStack from './components/Stacks/BikesStack';
import ScheduleStack from './components/Stacks/ScheduleStack';
import HistoryStack from './components/Stacks/HistoryStack';
import ActivitiesStack from './components/Stacks/ActivitiesStack';
import {Colors} from './constants/Colors'

// Push notification configuration
// const serverIp = '3.97.53.16'; // Server IP
const serverIp = '10.244.31.128'; // Amanda's local IP (ShawOpen, ubcsecure doesn't work)
// const serverIp = '192.168.1.11'; // Connor's local IP
// const serverIp = '192.168.1.83';  // Brennan's local IP

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);

    // Set global variables
    global.serverIp = serverIp;
    global.userId = 71747974; // TODO: set to actual ID fetched during login
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerTintColor: Colors.white,
            headerStyle: {backgroundColor: Colors.primaryOrange},
          }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Strava Authentication" component={StravaAuthScreen} />
          <Stack.Screen name="Home" component={this.HomeNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  HomeNavigator = () => {
    return (
      <Tab.Navigator
        initialRouteName="Schedule"
        activeColor={Colors.activeTabLightWhite}
        inactiveColor={Colors.inactiveTabLightBlack}
        labelStyle={{fontSize: 12}}
        barStyle={{backgroundColor: Colors.primaryOrange, marginTop: -22}}
        labeled={true}
        shifting={false}
        options={{
          tabBarTestID: 'BottomTabNavigator',
        }}>
        <Tab.Screen
          name="Schedule"
          component={ScheduleStack}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="schedule" color={color} size={26} />
            ),
            tabBarTestID: 'ScheduleTab',
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryStack}
          options={{
            tabBarColor: 'blue',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="history"
                color={color}
                size={26}
              />
            ),
            tabBarTestID: 'HistoryTab',
          }}
        />
        <Tab.Screen
          name="BikeStack"
          component={BikesStack}
          options={{
            title: 'Bikes',
            tabBarColor: 'red',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="bike" color={color} size={24} />
            ),
            tabBarTestID: 'BikesTab',
          }}
        />
        <Tab.Screen
          name="Activities"
          component={ActivitiesStack}
          options={{
            tabBarColor: 'green',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="bike-fast"
                color={color}
                size={24}
              />
            ),
            tabBarTestID: 'ActivitiesTab',
          }}
        />
      </Tab.Navigator>
    );
  }
}
