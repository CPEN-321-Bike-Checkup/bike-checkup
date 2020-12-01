import React from 'react';
import {Text, Button, View, Image, StyleSheet} from 'react-native';
import {Colors} from './../../constants/Colors'

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
  }

  render() {
    return (
    <View style={styles.view}>
        <Text style={styles.title}>Welcome to Bike Checkup!</Text>
        <Image source={require('./../../assets/AppIcon.png')} style={styles.image}/>
        <Text style={styles.description}>
            Bike Checkup is an app to help you master the bike maintenance game.
            Here, you can create a schedule of maintenance tasks for your bikes, with tasks linked to your
            Strava data so that you no longer need to manually keep track of bike and component usage.
            Enter the tasks you want to accomplish, and we will notify you with a weekly summary of
            upcoming tasks for the week. {"\n"} {"\n"}
            To get started, you will first need to connect your Strava account.
        </Text>
        <Button
            title='Continue to Strava connection'
            color={Colors.primaryOrange}
            onPress={() => this.navigation.replace('Strava Authentication')}
        />
    </View>
    );
  }
}

const styles = StyleSheet.create({
    view: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center'
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      paddingTop: 60,
      paddingBottom: 30,
      fontFamily: 'notoserif',
    },
    image: {
        width: 120,
        height: 120,
    },
    description: {
        paddingTop: 35,
        paddingBottom: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        textAlign: 'justify',
        fontFamily: 'notoserif',
    }
  });
