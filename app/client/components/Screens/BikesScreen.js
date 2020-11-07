import React from 'react';
import { } from 'react-native'
import { PressableListItem } from "../ListItems";
import { flatListWrapper } from "../FlatListWrapper";

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

export default class ScheduleScreen extends React.Component {
  constructor(props) {
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
      <PressableListItem
        title={item.title}
        onPress={() => this.navigation.navigate('Components', { bikeId: item.id })}
        testID={testId}
      />
    );
  }

  render() {
    return flatListWrapper(DATA, this.renderItem);
  }
}
