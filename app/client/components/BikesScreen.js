import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight } from 'react-native'

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

let Item = ({ title, onPress }) => {
  return (
  <TouchableHighlight style={styles.item} onPress={onPress} underlayColor = 'gainsboro'>
    <Text style={styles.title}>{title}</Text>
  </TouchableHighlight>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        maintenanceData: []
    };
    this.navigation = props.navigation;
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
    return (
      <TouchableHighlight>
        <Item
          title={item.title}
          onPress={() => this.navigation.navigate('Components', {bikeId: item.id})}
        />
      </TouchableHighlight>
    );
  }
  
  render() {
    return(
        <View style={styles.container}>
          <FlatList
            data={DATA}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => item + index}
            ItemSeparatorComponent={() => <View style={styles.separator}/>}
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