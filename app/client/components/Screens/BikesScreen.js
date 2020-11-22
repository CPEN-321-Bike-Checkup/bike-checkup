import React from 'react';
import axios from 'axios';
import {PressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';

const DATA = [
  {
    id: 1,
    title: 'Norco Sasquatch',
  },
  {
    id: 2,
    title: 'Giant Contend Ar 1',
  },
];

export default class BikesScreen extends React.Component {
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
    //     // this.setState({dateJSON: 'Error fetching data'})
    //     console.error(error);
    //   })
    //   .finally(() => {
    //     // this.setState({ isLoading: false });
    //   });;
  }

  //testing bike routes, remove if needed
  getBikes() {
    /* Fetch predictions from server */
    var serverIp = '3.97.53.16';
    axios
      .get('http://' + serverIp + ':5000/bike/bikes')
      .then((res) => {
        var bikes = res.data.bikes;
        console.log('INFO: Successfully fetched bikes: ' + bikes);

        //this.setState({predictedDates: dates});
      })
      .catch((err) => {
        console.log('ERROR: Failed to fetch bikes: ', err);
      });
  }

  renderItem = ({item}) => {
    const testId = 'BikeListItem' + this.itemCount;
    this.itemCount++;

    return (
      <PressableListItem
        title={item.title}
        onPress={() =>
          this.navigation.navigate('Components', {bikeId: item.id})
          // this.getBikes()
        }
        testID={testId}
      />
    );
  };

  render() {
    this.itemCount = 0;
    return flatListWrapper(DATA, this.renderItem, 'BikesList');
  }
}
