import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {ListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';

export default class TimeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      maintenanceRecords: [],
      fetchError: false,
    };
  }

  componentDidMount() {
    // TODO: pass id as a prop from App.js
    let userId = 123;

    fetch(`http://3.97.53.16:5000/maintenanceRecord/${userId}/days/100`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({maintenanceRecords: data});
      })
      .catch((error) => {
        // Display error screen
        this.setState({fetchError: true});
        console.error(error);
      })
      .finally(() => {
        // this.setState({ isLoading: false });
      });
  }

  render() {
    if (!this.state.fetchError) {
      return flatListWrapper(
        this.state.maintenanceRecords,
        ({item}) => (
          <ListItem
            title={item.description}
            subText={item.bike + ' - ' + item.component}
            rightText={new Date(item.maintenance_date).toLocaleDateString()}
          />
        ),
        'HistoryList',
      );
    } else {
      return (
        <View style={styles.container}>
          <Text>Error fetching maintenance records</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
