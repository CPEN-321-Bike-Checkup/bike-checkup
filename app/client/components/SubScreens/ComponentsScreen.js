import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  TouchableHighlight,
  TextInput,
  StyleSheet,
} from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import {RemovablePressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../AddButton';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';

const BIKE_COMPONENTS_LIST = [
  'Front Wheel',
  'Rear Wheel',
  'Fork',
  'Handlebar',
  'Pedals',
  'Front Tire',
  'Rear Tire',
  'Bottom Bracket',
  'Front Brake',
  'Rear Brake',
  'Front Brake Pads',
  'Rear Brake Pads',
  'Front Brake Lever',
  'Rear Brake Lever',
  'Cassette',
  'Chainrings',
  'Crankset',
  'Front Derailleur',
  'Rear Derailleur',
  'Headset',
  'Saddle',
  'Seatpost',
  'Stem',
  'Front Brake Cable',
  'Rear Brake Cable',
  'Front Shifter Cable',
  'Rear Shifter Cable',
  'Shift Levers',
  'Front Shock',
  'Rear Shock',
  'Front Brake Rotor',
  'Rear Brake Rotor',
  'Helmet',
  'Cleats',
];

// TODO: remove when we're done all testing
// const NORCO_DATA = [
//   {
//     id: 1,
//     title: 'Chain - CN-9000',
//   },
//   {
//     id: 2,
//     title: 'Brakes - Shimano BR-RS305-R Hydraulic Disc, 150mm',
//   },
//   {
//     id: 3,
//     title: 'Brake pads - Brake Authority Avids',
//   },
// ];

export default class ComponentsScreen extends React.Component {
  constructor(props) {
    console.log('ComponentsScreen Props:');
    console.log(props);
    super(props);
    this.state = {
      componentData: [],
      editMode: false,
      modalVisible: false,
      componentTypeInputText: '',
      componentNameInputText: '',
      nextId: 0,
      isError: false,
      errorText: null,
      fetchFailed: false,
    };
    this.navigation = props.navigation;
    this.bike = props.route.params.bike;
    this.removedComponents = [];
    this.itemCount = 0;
  }

  componentDidMount() {
    this.getComponents();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.navigation.addListener('focus', () => {
      this.getComponents();
      this.state.editMode = false;
    });
  }

  componentDidUpdate() {
    // Add edit button to navigation bar (side effect)
    let text = this.state.editMode ? 'Done' : 'Edit';
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode} testID="EditBtn">
          <Text style={CommonStyles.editButtonText}>{text}</Text>
        </TouchableOpacity>
      ),
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getComponents() {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component/${this.bike.id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((components) => {
          console.log('GOT COMPONENTS:');
          console.log(components);
          this.setState({
            componentData: this.transformComponentData(components),
          });
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your components. Check network connection.',
        fetchFailed: true,
      });

      console.error(error);
    });
  }

  transformComponentData = (components) => {
    let componentsList = [];
    for (let component of components) {
      let newComponent = {
        title: component.label,
        id: component._id,
      };
      componentsList.push(newComponent);
    }
    return componentsList;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  removeBikeComponent(id) {
    return () => {
      // Remove component
      let newComponentData = [...this.state.componentData];
      for (var i = 0; i < newComponentData.length; i++) {
        if (newComponentData[i].id == id) {
          let component = newComponentData.splice(i, 1)[0];
          this.removedComponents.push({_id: component.id}); // Remember removed component IDs
          this.setState({componentData: newComponentData});
        }
      }
    };
  }

  findBikeComponent(inputText) {
    if (inputText === '') return [];

    const regex = new RegExp(`${inputText.trim()}`, 'i');
    return BIKE_COMPONENTS_LIST.sort().filter(
      (component) => component.search(regex) >= 0,
    );
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    // TODO: Notify server of removed components
    if (this.state.editMode) {
      this.removedComponents = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  deleteComponents(tasks) {
    console.log(tasks);
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/maintenanceTask`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      }).then((response) => {
        // TODO: check response status
        // TODO: make sure back-end makes prediction for task before responding
        console.log('SUCCESSFULLY DELETED TASK: ', response);
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to delete your tasks. Check network connection.',
        fetchFailed: true,
      });

      //refetch components
      this.getComponents();

      console.error(error);
    });
  }

  renderItem = ({item}) => {
    const testId = 'ComponentListItem' + this.itemCount;
    this.itemCount++;

    return (
      <RemovablePressableListItem
        title={item.title}
        editMode={this.state.editMode}
        onPress={() => {
          this.navigation.navigate('Tasks', {
            bike: this.bike,
            component: item,
          });
        }}
        onRemovePress={this.removeBikeComponent(item.id)}
        testID={testId}
      />
    );
  };

  render() {
    const {componentTypeInputText} = this.state;
    const components = this.findBikeComponent(componentTypeInputText);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <View style={{flex: 1}}>
        {!this.state.fetchFailed ? (
          flatListWrapper(
            this.state.componentData,
            this.renderItem,
            'ComponentsList',
          )
        ) : (
          <View style={CommonStyles.fetchFailedView}>
            <Text>Error fetching components.</Text>
          </View>
        )}

        {AddButton(() => {
          this.navigation.navigate('Add Component', {bike: this.bike});
        })}

        {ErrorPopup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </View>
    );
  }
}
