import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maintenanceRecords: [],
      isError: false,
      fetchFailed: false,
      errorText: null,
    };
  }

  componentDidMount() {
    this.getHistory();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getHistory();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getHistory = () => {
    timeout(
      3000,
      fetch(
        `http://3.97.53.16:5000/maintenanceRecord/${global.userId}/days/100`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.setState({maintenanceRecords: data});
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
            this.state.maintenanceRecords,
            this.renderItem,
            'HistoryList',
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
