import React from 'react';
import { FlatList, StyleSheet, Text, View, TouchableHighlight, TouchableOpacity } from 'react-native'


const GIANT_DATA = [
  {
    id: 1,
    title: 'Brakes - Shimano 105 Hydraulic Disc, 160mm',
  },
  {
    id: 2,
    title: 'Chain - KMC X11EL-1',
  },
  {
    id: 3,
    title: 'Brake pads - Shimano BR-M555 M02',
  },
];

const NORCO_DATA = [
  {
    id: 1,
    title: 'Brakes - Shimano BR-RS305-R Hydraulic Disc, 150mm',
  },
  {
    id: 2,
    title: 'Chain - CN-9000',
  },
  {
    id: 3,
    title: 'Brake pads - Brake Authority Avids',
  },
];

// These don't need to be pressable for now
let Item = ({ title, onPress }) => {
  return (
    <TouchableHighlight style={styles.item} onPress={onPress} underlayColor='gainsboro'>
      <Text style={styles.title}>{title}</Text>
    </TouchableHighlight>
  );
};


export default class ScheduleScreen extends React.Component {
  constructor(props) {
    console.log('ComponentScreen Props:')
    console.log(props)
    super(props);
    this.state = {
      maintenanceData: [],
      editMode: false
    };
    this.navigation = props.navigation;
    this.bikeId = props.route.params.bikeId;
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
    //     // this.setState({dateJSON: 'Error fetching data'})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    console.log('STATE UPDATING')
    console.log(this)
    this.setState({ editMode: this.editMode ? false : true });
    console.log('STATE UPDATED')
    console.log(this.state)
  }

  renderItem = ({ item }) => {
    return (
      <Item
        title={item.title}
        onPress={() => this.navigation.navigate('ComponentSchedule', { bikId: this.bikeId, componentId: item.id })}
      />
    );
  }

  render() {
    // Add edit button to navigation bar
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });

    return (
      <View style={styles.container}>
        <FlatList
          data={this.bikeId == 1 ? NORCO_DATA : GIANT_DATA}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item + index}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: 'white',
    padding: 18,
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 20
  },
  editButtonText: {
    fontSize: 15,
    color: 'white',
    padding: 10,
    fontWeight: 'bold'
  }
});