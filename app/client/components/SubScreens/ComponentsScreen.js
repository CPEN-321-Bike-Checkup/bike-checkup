import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {RemovablePressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import CommonStyles from '../CommonStyles';

const BIKE_COMPONENTS_LIST = [
  "Front Wheel",
  "Rear Wheel",
  "Fork",
  "Handlebar",
  "Pedals",
  "Front Tire",
  "Rear Tire",
  "Bottom Bracket",
  "Front Brake",
  "Rear Brake",
  "Front Brake Pads",
  "Rear Brake Pads",
  "Front Brake Lever",
  "Rear Brake Lever",
  "Cassette",
  "Chainrings",
  "Crankset",
  "Front Derailleur",
  "Rear Derailleur",
  "Headset",
  "Saddle",
  "Seatpost",
  "Stem",
  "Front Brake Cable",
  "Rear Brake Cable",
  "Front Shifter Cable",
  "Rear Shifter Cable",
  "Shift Levers",
  "Front Shock",
  "Rear Shock",
  "Front Brake Rotor",
  "Rear Brake Rotor",
];

const OTHER_COMPONENTS_LIST = [
  "Helmet",
  "Cleats"
];

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

export default class ComponentsScreen extends React.Component {
  constructor(props) {
    console.log('ComponentScreen Props:');
    console.log(props);
    super(props);
    this.state = {
      componentData: [], // TODO: make into associative array
      editMode: false,
    };
    this.navigation = props.navigation;
    this.bikeId = props.route.params.bikeId;
    this.removedComponents = [];
  }

  updatecomponentData() {
    // this.setState({componentData: })
  }

  componentDidMount() {
    // fetch('3.97.53.16:8080/maintenance-schedule/', {
    //   method: 'GET'
    //   })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     this.updatecomponentData({dateJSON: data})
    //   })
    //   .catch((error) => {
    //     // this.setState({dateJSON: 'Error fetching data'})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;

    // Add edit button to navigation bar (side effect)
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode} testID="EditBtn">
          <Text style={CommonStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });

    this.setState({componentData: this.bikeId === 1 ? NORCO_DATA : GIANT_DATA});
  }

  addBikeComponent() {}

  removeBikeComponent(id) {
    return () => {
      // Remove component
      let newComponentData = [...this.state.componentData];
      for (var i = 0; i < newComponentData.length; i++) {
        if (newComponentData[i].id == id) {
          let component = newComponentData.splice(i, 1);
          this.removedComponents.push(component.id); // Remember removed component IDs
          this.setState({componentData: newComponentData});
        }
      }
    };
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    // TODO: Notify server of removed components
    if (this.state.editMode) {
      this.removedComponents = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  renderItem = ({item}) => {
    const testId = 'ComponentListItem' + this.itemCount;
    this.itemCount++;

    return (
      <RemovablePressableListItem
        title={item.title}
        editMode={this.state.editMode}
        onPress={() => {
          this.navigation.navigate('ComponentTaskScreen', {
            bikeId: this.bikeId,
            componentId: item.id,
          });
        }}
        onRemovePress={this.removeBikeComponent(item.id)}
        testID={testId}
      />
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {flatListWrapper(
          this.state.componentData,
          this.renderItem,
          'ComponentsList',
        )}
        <View style={styles.addComponentButtonContainer}>
          <TouchableOpacity onPress={this.addComponent} style={styles.addComponentButton}>
            <Text style={styles.addComponentButtonIcon}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addComponentButtonContainer: {
    position: 'absolute',
    bottom: 20,
    width:'94%',
    alignItems:'flex-end'
  },
  addComponentButton: {
    backgroundColor: "#47ffb8",
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addComponentButtonIcon: {
    fontSize: 20,
  }
});
