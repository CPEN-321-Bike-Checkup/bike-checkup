import React from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native';
import {RemovableListItem, RemovablePressableListItem} from '../ListItems';
import {flatListWrapper} from '../FlatListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../AddButton';
import ErrorPopup from '../ErrorPopup';
import {timeout} from '../ScreenUtils';

const DATA = [
  {
    id: 1,
    description: 'Bleed brakes',
    threshold: 400,
    repeats: true,
  },
  {
    id: 2,
    description: 'Replace chain',
    threshold: 200,
    repeats: true,
  },
  {
    id: 3,
    description: 'Check brake pads',
    threshold: 54,
    repeats: true,
  },
];

export default class ComponentTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskData: [],
      editMode: false,
      isError: false,
      errorText: null,
    };
    this.navigation = props.navigation;
    this.bike = props.route.params.bike;
    this.component = props.route.params.component;
    this.removedTasks = [];
    this.itemCount = 0;
  }

  updateMaintenanceData() {
    // this.setState({maintenanceData: })
  }

  componentDidMount() {
    this.getTasks();

    /* NOTE: In React class components, the render method itself shouldn’t cause 
     side effects. It would be too early — we typically want to perform our
     effects after React has updated the DOM. */

    // Add edit button to navigation bar (side effect)
    this.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={this.toggleEditMode}>
          <Text style={CommonStyles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      ),
    });
  }

  getTasks() {
    timeout(
      3000,
      fetch(
        `http://${global.serverIp}:5000/maintenanceTask?componentId=${this.component.id}`,
        {
          method: 'GET',
        },
      )
        .then((response) => response.json())
        .then((tasks) => {
          console.log('GOT TASKS:');
          console.log(tasks);
          this.setState({taskData: this.transformTaskData(tasks)});
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to retrieve your tasks. Check network connection.',
      });

      console.error(error);
    });
  }

  transformTaskData = (tasks) => {
    let tasksList = [];
    for (let task of tasks) {
      console.log('Task:');
      console.log(task);
      let newTask = {
        id: task.taskId,
        description: task.description,
        threshold: task.threshold,
        repeats: task.repeats,
        taskType: task.scheduleType,
      };
      tasksList.push(newTask);
    }
    return tasksList;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  addTask = () => {
    this.navigation.navigate('AddTaskScreen', {
      isNewTask: true,
      fixedBike: this.bike,
      fixedComponent: this.component,
    });
  };

  removeTask(id) {
    return () => {
      // Remove task
      let newTaskData = [...this.state.taskData];
      for (var i = 0; i < newTaskData.length; i++) {
        if (newTaskData[i].id == id) {
          let task = newTaskData.splice(i, 1);
          this.removedTasks.push(task.id); // Remember removed task IDs
          this.setState({taskData: newTaskData});
        }
      }
    };
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    // TODO: Notify server of removed tasks
    if (this.state.editMode) {
      this.removedTasks = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  renderItem = ({item}) => {
    const testId = 'TasksListItem' + this.itemCount;
    this.itemCount++;

    if (this.state.editMode) {
      var renderableItem = (
        <RemovablePressableListItem
          title={item.description}
          editMode={this.state.editMode}
          onPress={() => {
            this.navigation.navigate('AddTaskScreen', {
              fixedBike: this.bike,
              fixedComponent: this.component,
              taskId: item.id,
              isNewTask: false,
              task: {
                id: item.id,
                description: item.description,
                taskType: item.taskType,
                threshold: item.threshold,
                isRepeating: item.repeats,
              },
            });
          }}
          onRemovePress={this.removeTask(item.id)}
          testId={testId}
        />
      );
    } else {
      var renderableItem = (
        <RemovableListItem
          title={item.description}
          editMode={this.state.editMode}
          testId={testId}
        />
      );
    }

    return renderableItem;
  };

  render() {
    this.itemCount = 0;

    return (
      <View style={styles.container}>
        {flatListWrapper(this.state.taskData, this.renderItem, 'TasksList')}
        {AddButton(this.addTask)}
        {ErrorPopup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
});
