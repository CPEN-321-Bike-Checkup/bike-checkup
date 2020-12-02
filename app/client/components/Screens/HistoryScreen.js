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

export default class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.state = {
      maintenanceRecords: [],
      isError: false,
      fetchState: FETCH_IN_PROGRESS,
      errorText: null,
      numDays: 30,
      moreDate: false,
    };
  }

  componentDidMount() {
    this.getHistory();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.setState((stateOld) => {
        console.log('Days filer: ', stateOld.numDays - 30);
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
        .then((history) => {
          console.log('Got history: ', history);
          this.setState((stateOld) => {
            return {
              moreData: history.length != this.state.history.length,
              maintenanceRecords: history,
              numDays: stateOld.numDays + 30,
              fetchState: FETCH_SUCCEEDED,
            };
          });
        }),
    ).catch((error) => {
      // Display error screen
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your maintenance records. Check network connection.',
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

  renderItem = ({item}) => (
    <ListItem
      title={item.description}
      subText={item.bike + ' - ' + item.component}
      rightText={
        new Date(item.maintenance_date) instanceof Date &&
        !isNaN(new Date(item.maintenance_date))
          ? new Date(item.maintenance_date).toLocaleDateString()
          : ''
      }
    />
  );

  render() {
    let mainView = null;

    if (this.state.fetchState == FETCH_FAILED) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>Error fetching maintenance records.</Text>
        </View>
      );
    } else if (this.state.maintenanceRecords.length > 0) {
      mainView = flatListWrapper(
        this.state.maintenanceRecords,
        this.renderItem,
        'HistoryList',
        this.state.moreData ? LoadButton(() => this.getHistory()) : null,
      );
    } else if (this.state.fetchState != FETCH_IN_PROGRESS) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>No maintenance history.</Text>
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
