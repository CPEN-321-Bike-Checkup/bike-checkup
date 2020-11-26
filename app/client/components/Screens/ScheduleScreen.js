import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {CompletableListItem} from '../ListItems';
import {selectionListWrapper} from '../SectionListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../AddButton';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';

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
        task: 'Replace casette',
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
      {
        taskId: 8,
        bike: 'Giant Contend AR 1',
        task: 'Replace chain',
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
      isError: false,
      fetchFailed: false,
      errorText: null,
    };
    this.navigation = props.navigation;
    this.itemCount = 0;
    this.removedTasks = [];
  }

  componentDidMount() {
    this.getSchedule();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.navigation.addListener('focus', () => {
      this.getSchedule();
    });
  }

  componentDidUpdate() {
    // Add edit button to navigation bar (side effect)
    let text = this.state.editMode ? 'Done' : 'Edit';
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode} testID="EditBtn">
          <Text style={CommonStyles.editButtonText}>{text}</Text>
        </TouchableOpacity>
      ),
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getSchedule() {
    // timeout(
    //   3000,
    //   fetch(
    //     `http://${global.serverIp}:5000/maintenanceTask?userId=${global.userId}`,
    //     {
    //       method: 'GET',
    //     },
    //   )
    //     .then((response) => response.json())
    //     .then((schedule) => {
    //       console.log('GOT SCHEDULE:');
    //       console.log(schedule);
    //       this.setState({scheduleData: this.transformSchedule(schedule)});
    //     }),
    // ).catch((error) => {
    //   // Display error popup
    //   this.setState({
    //     isError: true,
    //     errorText:
    //       'Failed to retrieve your schedule. Check network connection.',
    //     fetchFailed: true,
    //   });

    //   console.error(error);
    // });
    this.setState({scheduleData: DATA}); // TODO: remove
  }

  completeTasks(tasks) {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/maintenanceTask/complete`, {
        method: 'POST',
        body: JSON.stringify(tasks),
      }).then((response) => {
        // TODO: check response status (and throw error if not success)
        console.log('SUCCESSFULLY SAVED TASK');
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve complete your tasks. Check network connection.',
        fetchFailed: true,
      });

      // Re-fetch schedule
      getSchedule();

      console.error(error);
    });
  }

  transformSchedule = (scheduleArr) => {
    let newScheduleArr = [];
    for (let task of scheduleArr) {
      let newTask = {
        // TODO: set all necessary fields (check that this works)
        taskId: task.taskId,
        bike: task.bike,
        component: task.component,
        task: task.description,
        date: task.predicted_due_date,
      };
      newScheduleArr.push(newTask);
    }
    return newScheduleArr;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    // Delete the removed components on remote
    if (this.state.editMode) {
      if (this.removedTasks.length != 0) {
        this.completeTasks(this.removedTasks);
      }
      this.removedTasks = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  scheduledTaskCompleted = (id) => {
    return () => {
      if (id == undefined) throw Error('Completed task id is undefined');
      console.log('scheduledTaskCompleted');

      // Remove component
      let found = false;
      let newScheduleData = [...this.state.scheduleData];
      for (var j = 0; j < this.state.scheduleData.length; j++) {
        for (var i = 0; i < newScheduleData[j].data.length; i++) {
          if (newScheduleData[j].data[i].taskId == id) {
            let task = newScheduleData[j].data.splice(i, 1);
            this.removedTasks.push(task.taskId); // Remember completed task IDs
            this.setState({scheduleData: newScheduleData});
            found = true;
            break;
          }
        }
        if (found) break;
      }
    };
  };

  renderItem = ({item}) => {
    const testId = 'ScheduleListItem' + this.itemCount;
    this.itemCount++;

    return (
      <CompletableListItem
        title={item.task}
        subText={item.bike + ' - ' + item.component}
        rightText={item.date}
        onCompletePress={this.scheduledTaskCompleted(item.taskId)}
        editMode={this.state.editMode}
        testID={testId}
      />
    );
  };

  render() {
    this.itemCount = 0;

    return (
      <View style={{flex: 1}}>
        {!this.state.fetchFailed ? (
          selectionListWrapper(
            this.state.scheduleData,
            this.renderItem,
            'ScheduleList',
          )
        ) : (
          <View style={CommonStyles.fetchFailedView}>
            <Text>Error fetching your schedule.</Text>
          </View>
        )}

        {AddButton(() => {
          this.navigation.navigate('Add Task', {isNewTask: true});
        })}

        {ErrorPopup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </View>
    );
  }
}
