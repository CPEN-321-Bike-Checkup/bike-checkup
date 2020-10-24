/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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



import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import HomeScreen from './components/HomeScreen';
import TimeScreen from './components/TimeScreen';
import MaintenancePrediction from './components/MaintenancePrediction';
//import BurndownChart from './components/BurndownChart';

const Stack = createStackNavigator();

const App: () => React$Node = () => {
  return (
    <>
      <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              options={{title:"Connor Shannon M5"}}
              component={HomeScreen}
            />
            <Stack.Screen
              name="TimeScreen"
              options={{title:"Current Time on Server"}}
              component={TimeScreen}
            />
            <Stack.Screen
              name="MaintenancePrediction"
              options={{title:"Maintenance Prediction"}}
              component={MaintenancePrediction}
            />
          </Stack.Navigator>
      </NavigationContainer>    
    </>
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
