import React from 'react';
import {View, Text} from 'react-native';
import {PressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';

// const DATA = [
//   {
//     id: 1,
//     title: 'Norco Sasquatch',
//   },
//   {
//     id: 2,
//     title: 'Giant Contend Ar 1',
//   },
// ];

export default class BikesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bikeData: [],
      isError: false,
      fetchFailed: false,
      errorText: null,
    };
    this.navigation = props.navigation;
    this.itemCount = 0;
  }

  componentDidMount() {
    this.getBikes();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.navigation.addListener('focus', () => {
      this.getBikes();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getBikes() {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/bike/${global.userId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((bikes) => {
          console.log('GOT BIKES:');
          console.log(bikes);
          this.setState({bikeData: this.transformBikeData(bikes)});
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to retrieve your bikes. Check network connection.',
        fetchFailed: true,
      });

      console.error(error);
    });
  }

  transformBikeData = (bikes) => {
    let bikesList = [];
    for (let bike of bikes) {
      let newBike = {
        title: bike.label,
        id: bike._id,
      };
      bikesList.push(newBike);
    }
    return bikesList;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  renderItem = ({item}) => {
    const testId = 'BikeListItem' + this.itemCount;
    this.itemCount++;

    return (
      <PressableListItem
        title={item.title}
        onPress={() => this.navigation.navigate('Components', {bike: item})}
        testID={testId}
      />
    );
  };

  render() {
    this.itemCount = 0;
    return (
      <>
        {!this.state.fetchFailed ? (
          flatListWrapper(this.state.bikeData, this.renderItem, 'BikesList')
        ) : (
          <View style={CommonStyles.fetchFailedView}>
            <Text>Error fetching bikes.</Text>
          </View>
        )}
        {ErrorPopup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </>
    );
  }
}
