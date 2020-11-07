import React from 'react';
import { Button, View } from 'react-native';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: '',
        };
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 50 }}>
                <Button
                    title="Predict Maintenance"
                    onPress={() => this.props.navigation.navigate('MaintenancePrediction')}
                />
            </View>
        );
    }
}

