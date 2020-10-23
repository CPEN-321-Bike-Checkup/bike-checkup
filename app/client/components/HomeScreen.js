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
                        title="Get current time"
                        onPress={() => this.props.navigation.navigate('TimeScreen')} 
                    />
                </View>
            </>
        );
    }
}

