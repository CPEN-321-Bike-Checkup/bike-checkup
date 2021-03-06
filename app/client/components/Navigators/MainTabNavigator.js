import React, {Component} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import BikesStack from './BikesStack';
import ScheduleStack from './ScheduleStack';
import HistoryStack from './HistoryStack';
import ActivitiesStack from './ActivitiesStack';
import {Colors} from '../../constants/Colors';
import SettingsStack from './SettingsStack';

const Tab = createMaterialBottomTabNavigator();

export default class MainTabNavigator extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Tab.Navigator
        initialRouteName="Schedule"
        activeColor={Colors.activeTabWhite}
        inactiveColor={Colors.inactiveTabBlack}
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
              <MaterialCommunityIcons name="history" color={color} size={26} />
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
        <Tab.Screen
          name="Settings"
          component={SettingsStack}
          options={{
            tabBarColor: 'green',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="account-settings"
                color={color}
                size={24}
              />
            ),
            tabBarTestID: 'SettingsTab',
          }}
        />
      </Tab.Navigator>
    );
  }
}
