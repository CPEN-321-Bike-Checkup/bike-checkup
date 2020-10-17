import React, { Component } from 'react';
import { Text, Button, View } from 'react-native'


export default class HomeScreen extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            time: ''
        };
    }
    
    render(){
        return(
            <>
                <View style={{flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 50}}>
                    <Button
                        title="View My hometown"
                        onPress={() => this.props.navigation.navigate('MapsScreen')} 
                    />
                    <Button
                        title="Get current time"
                        onPress={() => this.props.navigation.navigate('TimeScreen')} 
                    />
                    <Button
                        title="Supprise Function"
                        onPress={() => this.props.navigation.navigate('OtherFunction')} 
                    />
                    <Button
                        title="Burndown Chart"
                        onPress={() => this.props.navigation.navigate('BurndownChart')} 
                    />
                </View>
            </>
        );
    }
}

