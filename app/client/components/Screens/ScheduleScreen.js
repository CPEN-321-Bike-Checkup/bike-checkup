import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {CompletableListItem} from '../SubScreens/ListItems';
import {selectionListWrapper} from '../SubComponents/SectionListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../SubComponents/AddButton';
import ErrorPopup from '../SubComponents/ErrorPopup';
import {timeout} from '../ScreenUtils';

const FETCH_IN_PROGRESS = 0;
const FETCH_SUCCEEDED = 1;
const FETCH_FAILED = 2;

export default class ScheduleScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleData: [],
      editMode: false,
      isError: false,
      fetchState: FETCH_IN_PROGRESS,
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
    let text = this.state.editMode ? 'Done' : 'Complete';
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
          console.log('Got schedule: ', schedule);
          this.setState({
            scheduleData: this.filterSchedule(schedule),
            fetchState: FETCH_SUCCEEDED
          });
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your schedule. Check network connection.',
        fetchState: FETCH_FAILED,
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
        console.log('Successfully saved task: ', response);
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

  filterSchedule = (scheduleArr) => {
    for (var i = 0; i < scheduleArr.length; ) {
      console.log(scheduleArr[i].data);
      // Remove category if it is empty
      if (scheduleArr[i].data.length == 0) {
        scheduleArr.splice(i, 1);
      } else {
        i++;
      }
    }
    return scheduleArr;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  // Note: Arrow function needed to bind correct context
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

    var isValidDate =
      new Date(item.date) instanceof Date && !isNaN(new Date(item.date));

    return (
      <CompletableListItem
        title={item.task}
        subText={item.bike + ' - ' + item.component}
        rightText={isValidDate ? new Date(item.date).toLocaleDateString() : ''}
        onCompletePress={this.scheduledTaskCompleted(item.taskId)}
        editMode={this.state.editMode}
        testID={testId}
      />
    );
  };

  render() {
    this.itemCount = 0;

    let mainView = null;

    if (this.state.fetchState == FETCH_FAILED) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>Error fetching your schedule.</Text>
        </View>
      );
    } else if (this.state.scheduleData.length > 0) {
      mainView = selectionListWrapper(
        this.state.scheduleData,
        this.renderItem,
        'ScheduleList',
      );
    } else if (this.state.fetchState != FETCH_IN_PROGRESS) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>No upcoming tasks scheduled.</Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        {mainView}

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
