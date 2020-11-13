import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {EditablePressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import CommonStyles from '../CommonStyles';

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

export default class ScheduleScreen extends React.Component {
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
        <TouchableOpacity onPress={this.toggleEditMode}>
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
          this.removedComponents.push(component.id);  // Remember removed component IDs
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
      <EditablePressableListItem
        title={item.title}
        editMode={this.state.editMode}
        onPress={() => {
          this.navigation.navigate('ComponentTaskScreen', {
            bikId: this.bikeId,
            componentId: item.id,
          });
        }}
        onRemovePress={this.removeBikeComponent(item.id)}
        testID={testId}
      />
    );
  };

  render() {
    return flatListWrapper(
      this.state.componentData,
      this.renderItem,
      'BikesList',
    );
  }
}
