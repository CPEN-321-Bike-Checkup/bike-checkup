import React from 'react';
import {View, Text} from 'react-native';
import {ListItem} from '../SubComponents/ListItems';
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
      addedDays: false,
      moreData: true,
    };
  }

  componentDidMount() {
    this.getActivities(false);

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getActivities(false);
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getActivities = (addDays) => {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var daysToAdd = 30;
    if (!addDays) {
      daysToAdd = 0;
    }
    timeout(
      3000,
      fetch(
        `http://${global.serverIp}:5000/activity/${
          global.userId
        }/?afterDate=${tomorrow}&numDays=${this.state.numDays + daysToAdd}`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.json())
        .then((activities) => {
          this.setState((prevState) => {
            console.log(activities.length > 0);
            return {
              moreData:
                activities.length != prevState.activities.length || !addDays,
              activities: activities.sort(function (x, y) {
                return new Date(y.date) - new Date(x.date);
              }),
              numDays: prevState.numDays + daysToAdd,
              fetchState: FETCH_SUCCEEDED,
              addedDays: addDays,
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
        this.state.moreData ? LoadButton(() => this.getActivities(true)) : null,
      );
    } else if (this.state.fetchState != FETCH_IN_PROGRESS) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>No activities.</Text>
        </View>
      );
    }

    return (
      <>
        {mainView}
        {Popup(this.state.errorText, this.onErrorAccepted, this.state.isError)}
      </>
    );
  }
}
