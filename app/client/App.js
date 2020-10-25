/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';


import PushNotification from 'react-native-push-notification'

import { NavigationContainer } from '@react-navigation/native';


import HomeScreen from './components/HomeScreen';
import TimeScreen from './components/TimeScreen';
import MaintenanceScreen from './components/MaintenancePrediction';
//import BurndownChart from './components/BurndownChart';
//

var serverIp = '3.97.53.16';
PushNotification.configure({
    onRegister: (token) => {
        console.log('Remote Notification Token: ', token);
		fetch("http://" + serverIp + ":5000/user/registerDevice", {
			method: 'POST',
			body: JSON.stringify({userId: 1, token: token})	
		}).then((res) => {
                console.log("Registered Device");
            })
            .catch((err) => {
                console.log("Failed to register device: ", err);
            });
    },

    onNotification: (notification) => {
        console.log('Remote Notification Received: ', notification);
    },
    senderID: 517168871348,
    popInitialNotification: false,
    requestPermissions: true 
});

import ScheduleScreen from './components/ScheduleScreen';
import HistoryScreen from './components/HistoryScreen';
import BikesStack from './components/BikesStack';


const App: () => React$Node = () => {
  return (
    <NavigationContainer>
        <Tab.Navigator
            initialRouteName="Schedule"
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            labelStyle={{ fontSize: 12 }}
            barStyle={{ backgroundColor: 'tomato' }}
            labeled={true}
            shifting={false}
          >
          <Tab.Screen
            name="Schedule"
            component={ScheduleScreen}
            options={{
              tabBarColor: "#694fad",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="schedule" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="History"
            component={HistoryScreen}
            options={{
              tabBarColor: "blue",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="history" color={color} size={26} />
              ),
            }}
          />
          <Tab.Screen
            name="BikeStack"
            component={BikesStack}
            options={{
              title: "Bikes",
              tabBarColor: "red",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="bike" color={color} size={24} />
              ),
            }}
          />
          <Tab.Screen
            name="Activities"
            component={TimeScreen}
            options={{
              tabBarColor: "green",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="bike-fast" color={color} size={24} />
              ),
            }}
          />
           <Tab.Screen
            name="Maintenance"
            component={MaintenanceScreen}
            options={{
              tabBarColor: "green",
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="wrench" color={color} size={24} />
              ),
            }}
          />
        </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
