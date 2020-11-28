import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {CompletableListItem} from '../ListItems';
import {selectionListWrapper} from '../SectionListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../AddButton';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';

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
      this.state.editMode = false;
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
    timeout(
      3000,
      fetch(
        `http://${global.serverIp}:5000/maintenanceTask?userId=${global.userId}`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.json())
        .then((schedule) => {
          console.log('GOT SCHEDULE:');
          console.log(schedule);
          this.setState({
            scheduleData: /*this.transformSchedule(schedule)*/ schedule,
          });
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your schedule. Check network connection.',
        fetchFailed: true,
      });

      console.error(error);
    });
  }

  completeTasks(tasks) {
    console.log('Completed tasks: ', JSON.stringify(tasks));
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/maintenanceTask/complete`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tasks),
      }).then((response) => {
        // TODO: check response status (and throw error if not success)
        console.log('SUCCESSFULLY SAVED TASK: ', response);
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve complete your tasks. Check network connection.',
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
        task: task.task,
        date: task.date,
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
            let task = newScheduleData[j].data.splice(i, 1)[0];
            this.removedTasks.push({_id: task.taskId}); // Remember completed task IDs
            this.setState({scheduleData: newScheduleData});
            found = true;
            break;
          }
        }
        if (found) break;
      }
    };
  };

  numListItems = () => {
    let numItems = 0;
    for (let category of this.state.scheduleData) {
      numItems += category.data.length;
    }
    return numItems;
  };

  renderItem = ({item}) => {
    const testId = 'ScheduleListItem' + this.itemCount;
    this.itemCount++;
    // Reset here as list may be re-rendered w/o call to render()
    if (this.itemCount == this.numListItems()) {
      this.itemCount = 0;
    }

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
        }, 'ScheduleAddTaskBtn')}

        {ErrorPopup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </View>
    );
  }
}
