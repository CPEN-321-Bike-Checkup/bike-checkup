import React from 'react';
import {Text, Button, View} from 'react-native';

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.navigation = props.navigation;
  }

  render() {
    return (
    <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
        <Text>Hello, world!</Text>
        <Button
            title="Press me"
            color="#f194ff"
            onPress={() => this.navigation.navigate('Strava Authentication')}
        />
    </View>
    );
  }
}
