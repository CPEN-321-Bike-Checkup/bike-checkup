import React from 'react';
import {View, Text} from 'react-native';
import {ListItem} from '../SubScreens/ListItems';
import {flatListWrapper} from '../SubComponents/FlatListWrapper';
import ErrorPopup from '../SubComponents/ErrorPopup';
import {timeout} from '../ScreenUtils';
import CommonStyles from '../CommonStyles';
import LoadButton from '../SubComponents/LoadButton';

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.state = {
      maintenanceRecords: [],
      isError: false,
      fetchFailed: false,
      errorText: null,
      numDays: 30,
    };
  }

  componentDidMount() {
    this.getHistory();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState((stateOld) => {
        console.log('days filer: ', stateOld.numDays - 30);
        return {numDays: stateOld.numDays - 30};
      }, this.getHistory());
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getHistory = () => {
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
          console.log('GOT HISTORY');
          console.log(data);
          this.setState((stateOld) => {
            return {
              maintenanceRecords: data,
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
      rightText={
        new Date(item.date) instanceof Date && !isNaN(new Date(item.date))
          ? new Date(item.maintenance_date).toLocaleDateString()
          : ''
      }
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
            // Footer
            LoadButton(() => this.getHistory()),
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
