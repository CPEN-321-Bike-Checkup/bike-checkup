import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native'

const DATA = [
  {
    id: 1,
    title: "Norco Sasquatch",
  },
  {
    id: 2,
    title: "Giant Contend Ar 1",
  }
];

let Item = ({ title, onPress, testID }) => {
  return (
  <TouchableHighlight
    style={styles.item}
    onPress={onPress}
    underlayColor = 'gainsboro'
    testID = {testID}
  >
    <Text style={styles.title}>{title}</Text>
  </TouchableHighlight>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        maintenanceData: [],
    };
    this.navigation = props.navigation;
    this.itemCount = 0;
  }

  updateMaintenanceData() {
    // this.setState({maintenanceData: })
  }

  componentDidMount() {
    // fetch('3.97.53.16:8080/maintenance-schedule/', {
    //   method: 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     this.updateMaintenanceData({dateJSON: data})
    //   })
    //   .catch((error) => {
    //     // this.setState({dateJSON: "Error fetching data"})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;
  }

  renderItem = ({ item }) => {
    const testId = "BikeListItem" + this.itemCount;
    this.itemCount++;

    return (
      <Item
        title={item.title}
        onPress={() => this.navigation.navigate('Components', {bikeId: item.id})}
        testID={testId}
      />
    );
  }
  
  render() {
    return(
        <View
          style={styles.container}
          testID="BikesView"
        >
          <FlatList
            data={DATA}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
            testID="BikesList"
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "white",
    padding: 18,
  },
  title: {
    fontSize: 20
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
});