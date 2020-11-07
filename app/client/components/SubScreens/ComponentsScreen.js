import React from 'react';
import { Text, TouchableOpacity } from 'react-native'
import { PressableListItem } from '../ListItems';
import { flatListWrapper } from '../FlatListWrapper';
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
    this.setState({ editMode: this.editMode ? false : true });
  }

  renderItem = ({ item }) => {
    const testId = 'ComponentListItem' + this.itemCount;
    this.itemCount++;

    return (
      <PressableListItem
        title={item.title}
        onPress={() => this.navigation.navigate('ComponentSchedule', { bikId: this.bikeId, componentId: item.id })}
        testID={testId}
      />
    );
  }

  render() {
    // Add edit button to navigation bar
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity>
          <Text style={CommonStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });

    return flatListWrapper(
      this.bikeId === 1 ? NORCO_DATA : GIANT_DATA,
      this.renderItem,
      'BikesList'
    );
  }
}
