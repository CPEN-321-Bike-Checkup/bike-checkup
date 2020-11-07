import React from 'react';
import { } from 'react-native'
import { ListItem } from '../ListItems';
import { selectionListWrapper } from '../SectionListWrapper';

let getDate = function (offset) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString();
}

// Note: add separators based on dates
const DATA = [
  {
    title: 'Next 10 days',
    data: [
      { bike: 'Norco Sasquatch', task: 'Oil chain', date: getDate(0) },
      { bike: 'Giant Contend AR 1', task: 'Oil chain', date: getDate(2) },
      { bike: 'Norco Sasquatch', task: 'Check brake pads', date: getDate(7) },
    ]
  },
  {
    title: 'Next 50 Days',
    data: [
      { bike: 'Giant Contend AR 1', task: 'Replace chain', date: getDate(13) },
      { bike: 'Giant Contend AR 1', task: 'Check brake pads', date: getDate(22) },
      { bike: 'Norco Sasquatch', task: 'Oil chain', date: getDate(27) },
      { bike: 'Giant Contend AR 1', task: 'Oil chain', date: getDate(30) },
      { bike: 'Norco Sasquatch', task: 'Bleed brakes', date: getDate(46) },
      { bike: 'Giant Contend AR 1', task: 'Bleed brakes', date: getDate(50) },
    ]
  }
];


export default class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceData: []
    };
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
  render() {
    return selectionListWrapper(DATA, ({ item }) => <ListItem item={item} />);
  }
}
