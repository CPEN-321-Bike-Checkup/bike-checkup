import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {CompletableListItem} from '../ListItems';
import {selectionListWrapper} from '../SectionListWrapper';
import CommonStyles from '../CommonStyles';

let getDate = function (offset) {
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + offset);
  return currentDate.toLocaleDateString();
};

// Note: add separators based on dates
const DATA = [
  {
    title: 'Next 10 days',
    data: [
      {taskId: 0, bike: 'Norco Sasquatch', task: 'Oil chain', date: getDate(0)},
      {
        taskId: 1,
        bike: 'Giant Contend AR 1',
        task: 'Oil chain',
        date: getDate(2),
      },
      {
        taskId: 2,
        bike: 'Norco Sasquatch',
        task: 'Check brake pads',
        date: getDate(7),
      },
    ],
  },
  {
    title: 'Next 50 Days',
    data: [
      {
        taskId: 3,
        bike: 'Giant Contend AR 1',
        task: 'Replace chain',
        date: getDate(13),
      },
      {
        taskId: 4,
        bike: 'Giant Contend AR 1',
        task: 'Check brake pads',
        date: getDate(22),
      },
      {
        taskId: 5,
        bike: 'Norco Sasquatch',
        task: 'Oil chain',
        date: getDate(27),
      },
      {
        taskId: 6,
        bike: 'Giant Contend AR 1',
        task: 'Oil chain',
        date: getDate(30),
      },
      {
        taskId: 7,
        bike: 'Norco Sasquatch',
        task: 'Bleed brakes',
        date: getDate(46),
      },
      {
        taskId: 8,
        bike: 'Giant Contend AR 1',
        task: 'Bleed brakes',
        date: getDate(50),
      },
    ],
  },
];

export default class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleData: [],
      editMode: false,
    };
    this.navigation = props.navigation;
    this.itemCount = 0;
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

    this.setState({scheduleData: DATA});

    // Add edit button to navigation bar (side effect)
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode}>
          <Text style={CommonStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    // TODO: Notify server of removed components
    if (this.state.editMode) {
      this.removedComponents = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  scheduledTaskCompleted = (id) => {
    return () => {
      // Remove component
      let newScheduleData = [...this.state.ScheduleData];
      for (var i = 0; i < newScheduleData.length; i++) {
        if (newScheduleData[i].id == id) {
          let component = newScheduleData.splice(i, 1);
          this.removedComponents.push(component.id); // Remember removed component IDs
          this.setState({ScheduleData: newScheduleData});
        }
      }
    };
  };

  renderItem = ({item}) => {
    const testId = 'ScheduleListItem' + this.itemCount;
    this.itemCount++;

    return (
      <CompletableListItem
        title={item.task}
        subText={item.bike}
        rightText={item.date}
        onCompletePress={this.scheduledTaskCompleted(item.id)}
        editMode={this.state.editMode}
        testID={testId}
      />
    );
  };

  render() {
    this.itemCount = 0;

    return selectionListWrapper(
      this.state.scheduleData,
      this.renderItem,
      'ScheduleList',
    );
  }
}
