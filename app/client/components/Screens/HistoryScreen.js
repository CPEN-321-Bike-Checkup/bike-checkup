import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
  } from 'react-native'

export default class TimeScreen extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>To be implemented post-MVP</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 3,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  })