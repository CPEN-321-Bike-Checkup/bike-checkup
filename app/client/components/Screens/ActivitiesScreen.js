import React from 'react';
import {View, Text} from 'react-native';
import {ListItem} from '../SubScreens/ListItems';
import {flatListWrapper} from '../SubComponents/FlatListWrapper';
import Popup from '../SubComponents/Popup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';
import LoadButton from '../SubComponents/LoadButton';

const FETCH_IN_PROGRESS = 0;
const FETCH_SUCCEEDED = 1;
const FETCH_FAILED = 2;

export default class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.state = {
      activities: [],
      isError: false,
      fetchState: FETCH_IN_PROGRESS,
      errorText: null,
      numDays: 30,
    };
  }

  componentDidMount() {
    this.getActivities();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState((stateOld) => {
        console.log('Days filer: ', stateOld.numDays - 30);
        return {numDays: stateOld.numDays - 30};
      }, this.getActivities());
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getActivities = () => {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    timeout(
      3000,
      fetch(
        `http://${global.serverIp}:5000/activity/${global.userId}/?afterDate=${tomorrow}&numDays=${this.state.numDays}`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.json())
        .then((data) => {
          this.setState((prevState) => {
            return {
              activities: data.sort(function (x, y) {
                return new Date(y.date) - new Date(x.date);
              }),
              numDays: prevState.numDays + 30,
              fetchState: FETCH_SUCCEEDED,
            };
          });
        }),
    ).catch((error) => {
      // Display error screen
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your Activities. Check network connection.',
        fetchState: FETCH_FAILED,
      });

      console.error(error);
    });
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  renderItem = ({item}) => {
    var date = new Date(0);
    date.setSeconds(item.time_s); // Specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    var distance = item.distance / 1000;
    return (
      <ListItem
        title={item.description}
        subText={distance.toFixed(2) + 'km - ' + timeString}
        rightText={new Date(item.date).toLocaleDateString()}
      />
    );
  };

  render() {
    let mainView = null;

    if (this.state.fetchState == FETCH_FAILED) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>Error fetching Strava activities.</Text>
        </View>
      );
    } else if (this.state.activities.length > 0) {
      mainView = flatListWrapper(
        this.state.activities,
        this.renderItem,
        'ActivitiesList',
        LoadButton(() => this.getActivities()),
      );
    } else if (this.state.fetchState != FETCH_IN_PROGRESS) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>No activities in last {this.state.numDays} days.</Text>
        </View>
      );
    }

    return (
      <>
        {mainView}
        {Popup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </>
    );
  }
}
