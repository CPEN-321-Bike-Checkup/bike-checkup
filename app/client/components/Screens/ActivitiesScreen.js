import React from 'react';
import {View, Text, StyleSheet, Button, L} from 'react-native';
import {ListItem} from '../SubScreens/ListItems';
import {flatListWrapper} from '../SubComponents/FlatListWrapper';
import ErrorPopup from '../SubComponents/ErrorPopup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';
import LoadButton from '../SubComponents/LoadButton';

export default class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.state = {
      activities: [],
      isError: false,
      fetchFailed: false,
      errorText: null,
      numDays: 30,
    };
  }

  componentDidMount() {
    this.getActivities();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState((stateOld) => {
        console.log('days filer: ', stateOld.numDays - 30);
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
          console.log(data);
          this.setState((stateOld) => {
            return {
              activities: data,
              numDays: stateOld.numDays + 30,
            };
          });
        }),
    ).catch((error) => {
      // Display error screen
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your maintenance records. Check network connection.',
        fetchFailed: true,
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
    date.setSeconds(item.time_s); // specify value for SECONDS here
    var timeString = date.toISOString().substr(11, 8);
    console.log(timeString);
    var distance = item.distance / 1000;
    return (
      <ListItem
        title={item.description}
        subText={distance.toFixed(2) + 'Km - ' + timeString}
        rightText={new Date(item.date).toLocaleDateString()}
      />
    );
  };

  render() {
    return (
      <>
        {!this.state.fetchFailed ? (
          flatListWrapper(
            this.state.activities,
            this.renderItem,
            'HistoryList',
            // Footer
            LoadButton(() => this.getActivities()),
          )
        ) : (
          <View style={CommonStyles.fetchFailedView}>
            <Text>Error fetching maintenance records.</Text>
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
