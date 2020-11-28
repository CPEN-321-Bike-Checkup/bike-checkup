import React from 'react';
import {View, Text, StyleSheet, Button, L} from 'react-native';
import {ListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';

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
        `http://${global.serverIp}:5000/maintenanceRecord/${global.userId}/?beforeDate=${tomorrow}&numDays=${this.state.numDays}`,
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

  renderItem = ({item}) => (
    <ListItem
      title={item.description}
      subText={item.bike + ' - ' + item.component}
      rightText={new Date(item.maintenance_date).toLocaleDateString()}
    />
  );

  render() {
    return (
      <>
        {!this.state.fetchFailed ? (
          flatListWrapper(
            this.state.activities,
            this.renderItem,
            'HistoryList',
            //footer
            <Button
              onPress={() => this.getActivities()}
              title="Load Next 30 days of History"
              style={{marginTop: -20}}
            />,
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
