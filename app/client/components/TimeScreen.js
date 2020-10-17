import React, { Component } from 'react';
import { Text, Button, View } from 'react-native';
import { format } from 'date-fns';

export default class TimeScreen extends React.Component{


    constructor(props){
        super(props);
        this.state = {
            time: "",
            err: "mount err",
            serverIp: "168.62.30.177"
        };
    }
   

    componentDidMount(){
        this.GetTime();
    }
 

    GetTime(){
        this.setState((s) => {return {err: 'api err'};}, () => {
            fetch("http://" + this.state.serverIp + ":5000/time").then(res => res.json())
            .then((res) => {
                this.setState((state) => {return {time: format(Date.parse(res.time), "MMMM dd, yyy H:mm:ssa"), err: 'display err'};});
                console.log("Fetched time, time is " + this.state.time);
            })
            .catch((err) => {
                this.setState((s) => {return {err: 'api err: ' + err};});
                console.log("Failed to get time: " + err);
            });
        
        });
        
    }


    render(){
        return(
            <>
                <Text style={{flex: 1, textAlign: "center", textAlignVertical: "bottom", fontWeight: "bold"}}>The current Time on {this.state.serverIp} is:</Text>
                <Text style={{flex: 1, textAlign: "center", textAlignVertical: "center"}}>{this.state.time}</Text>
                <View style={{flex: 1, justifyContent: "flex-end"}}>
                    <Button onPress={() => {this.GetTime()}} title="Update Time"/>
                </View>
            </>
        );
    }
}








