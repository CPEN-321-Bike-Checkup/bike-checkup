import React, { Component } from 'react';
import { Text, Button, View } from 'react-native'
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from 'react-native';

export default class BurndownChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [1, 2, 4, 5]
    };
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const edgeMargin = 15;
  }

  render() {
    return (
      <>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 50 }}>
          <LineChart
            data={{
              labels: ["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30", "Nov 5"],
              datasets: [

                {
                  data: [
                    100,
                    95,
                    90,
                    82,
                    70,
                    62,
                    55,
                    48
                  ],
                  color: () => `rgba(233, 45, 128)`
                },
                {
                  data: [
                    100,
                    95,
                    90,
                    82,
                    70,
                    62]
                }

              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisLabel="Km "
            yAxisSuffix=""
            withDots={false}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />

        </View>
      </>
    );
  }
}

