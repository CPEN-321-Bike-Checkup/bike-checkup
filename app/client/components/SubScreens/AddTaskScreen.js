import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';
import Popup from '../SubComponents/Popup';
import {timeout} from '../ScreenUtils';
import {Colors} from './../../constants/Colors'

const TASK_TYPES = {
  TIME: 'date',
  DISTANCE: 'distance',
};

const TASK_TYPE_DATA = [
  {label: 'Time', value: TASK_TYPES.TIME},
  {label: 'Distance', value: TASK_TYPES.DISTANCE},
];

export default class AddTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceData: [],
      isSaving: false,
      isError: false,
      errorText: null,
      bikeList: [],
      componentList: [],
      fatalError: false,
      /* Task Fields */
      bikeId: null,
      componentId: null,
      description: null,
      taskType: null, // TODO: Brennan to temporarily change to TASK_TYPES.TIME when running e2e tests
      threshold: null,
      isRepeating: false,
    };
    this.navigation = props.navigation;

    // Params
    this.isNewTask = props.route.params.isNewTask; // Boolean for update or new
    if (!this.isNewTask) {
      let {
        id,
        description,
        taskType,
        threshold,
        isRepeating,
      } = props.route.params.task;
      this.state.taskId = id;
      this.state.description = description;
      this.state.taskType = taskType;
      this.state.threshold = threshold;
      this.state.isRepeating = isRepeating;
    }

    // Bike and component fixed if entering this screen from the ComponentTaskScreen
    this.fixedBike = props.route.params.fixedBike;
    this.fixedComponent = props.route.params.fixedComponent;
  }

  componentDidMount() {
    if (!this.fixedBike) {
      this.updateBikeList();
    }
  }

  transformBikeList = (bikes) => {
    let bikesList = [];
    for (let bike of bikes) {
      let newBike = {
        label: bike.label,
        value: bike._id,
      };
      bikesList.push(newBike);
    }
    return bikesList;
  };

  transformComponentList = (components) => {
    let componentsList = [];
    for (let component of components) {
      let newComponent = {
        label: component.label,
        value: component._id,
      };
      componentsList.push(newComponent);
    }
    return componentsList;
  };

  updateBikeList = () => {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/bike/${global.userId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((bikes) => {
          console.log('Got bikes: ', bikes);
          this.setState({bikeList: this.transformBikeList(bikes)});
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to retrieve your bikes. Check network connection.',
        fatalError: true,
      });

      console.error(error);
    });
  };

  updateComponentList = (bikeId) => {
    console.log('Update component list');
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component/${bikeId}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((components) => {
          console.log('Got components: ', components);

          // Navigate back if can't add a component
          if (components.length == 0) {
            this.setState({
              isError: true,
              errorText:
                'This bike has no components. A task needs to be attached to a component.',
            });
          }

          this.setState({
            componentList: this.transformComponentList(components),
          });
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          "Failed to retrieve your bike's components. Check network connection.",
        fatalError: true,
      });

      console.error(error);
    });
  };

  createTask = (task) => {
    // Send POST request
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/maintenanceTask/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      }).then((response) => {
        // TODO: check response status
        // TODO: make sure back-end makes prediction for task before responding
        console.log('Successfully saved task');
        this.navigation.goBack();
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to save task. Check network connection.',
      });

      console.error(error);
    });
  };

  // TODO: test this
  updateTask = (task) => {
    // Send PUT request
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/maintenanceTask/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      }).then((response) => {
        // TODO: check response status
        console.log('Successfully updated task');
        this.navigation.goBack();
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to update task. Check network connection.',
      });

      console.error(error);
    });
  };

  getDropDownPicker(data, onChangeCallback, defaultValue) {
    return (
      <DropDownPicker
        defaultValue={defaultValue} // Won't display if undefined or null
        style={{flex: 1}}
        items={data}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        placeholder="Select..."
        placeholderStyle={{color: Colors.grey, fontSize: 16}}
        selectedLabelStyle={{color: 'black', fontSize: 16}}
        containerStyle={{height: 50}}
        onChangeItem={(item) => onChangeCallback(item)}
      />
    );
  }

  getTextInput(onTextCallback, numeric, defaultValue, testID) {
    const keyboard = numeric ? 'numeric' : 'default';
    return (
      <TextInput
        defaultValue={defaultValue} // Won't display if undefined or null
        placeholder="Enter..."
        placeholderTextColor={Colors.grey}
        underlineColorAndroid={'black'}
        keyboardType={keyboard}
        onChangeText={onTextCallback}
        testID={testID}
        style={{
          paddingLeft: 6,
          fontSize: 16,
        }}></TextInput>
    );
  }

  getBikeFormItem = () => {
    if (this.fixedBike) {
      return (
        <View style={styles.formItemColumn} testID="FixedBikeText">
          <Text style={styles.formItemHeaderText}>Bike: </Text>
          <Text style={styles.fixedItemText}>{this.fixedBike.title}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Bike:</Text>
          {this.getDropDownPicker(
            this.state.bikeList,
            this.setBike,
            this.state.bikeId,
          )}
        </View>
      );
    }
  };

  getComponentFormItem = () => {
    if (this.fixedComponent) {
      return (
        <View style={styles.formItemColumn} testID="FixedComponentText">
          <Text style={styles.formItemHeaderText}>Component: </Text>
          <Text style={styles.fixedItemText}>{this.fixedComponent.title}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Component:</Text>
          {this.getDropDownPicker(
            this.state.componentList,
            this.setComponent,
            this.state.componentId,
          )}
        </View>
      );
    }
  };

  setBike = (item) => {
    this.setState({bikeId: item.value});

    // Fetch the bike's components
    this.updateComponentList(item.value);
  };

  setComponent = (item) => {
    this.setState({componentId: item.value});
  };

  setTaskTitle = (description) => {
    this.setState({description: description});
  };

  setTaskType = (item) => {
    this.setState({taskThreshold: null}); // Clear any previously set threshold
    this.setState({taskType: item.value});
  };

  setTaskThreshold = (thresholdStr) => {
    let threshold = parseInt(thresholdStr.replace(/[^0-9]/g, ''));
    this.setState({threshold: threshold});
  };

  setRepeatOption = (newVal) => {
    this.setState({isRepeating: newVal});
  };

  cancel = () => {
    if (!this.state.isSaving) {
      this.navigation.goBack();
    }
  };

  save = () => {
    this.setState({isSaving: true});

    let {bikeId, componentId, taskType, threshold, description} = this.state;

    // Check for form errors
    let errorText = null;
    if (!this.fixedBike && bikeId == null) {
      errorText = 'Please select a bike.';
    } else if (!this.fixedComponent && componentId == null) {
      errorText = 'Please select a component.';
    } else if (taskType == null) {
      errorText = 'Please select a task type (distance or time).';
    } else if (threshold == null) {
      errorText = 'Please enter a threshold.';
    } else if (threshold < 0) {
      errorText = 'Threshold cannot be negative.';
    } else if (description == null) {
      errorText = 'Please enter a task title.';
    }

    if (errorText) {
      this.setState({
        isError: true,
        errorText: errorText,
      });
      return;
    }

    let task = {
      component_id: this.fixedComponent
        ? this.fixedComponent.id
        : this.state.componentId,
      description: this.state.description,
      schedule_type: this.state.taskType,
      threshold_val: this.state.threshold,
      repeats: this.state.isRepeating,
    };

    if (this.isNewTask) {
      this.createTask(task);
    } else {
      task._id = this.state.taskId;
      this.updateTask(task);
    }
  };

  onErrorAccepted = () => {
    if (this.state.fatalError) {
      this.navigation.goBack();
    }

    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
      isSaving: false,
    });
  };

  render() {
    return (
      // NOTE: fix bike and component fields when entering from component task screen
      <ScrollView containerStyle={styles.formContainer} testID="AddTaskScreen">
        {this.getBikeFormItem()}
        {this.getComponentFormItem()}
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Title:</Text>
          {this.getTextInput(
            this.setTaskTitle,
            false,
            this.state.description,
            'TitleTextInput',
          )}
        </View>
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Type:</Text>
          {this.getDropDownPicker(
            TASK_TYPE_DATA,
            this.setTaskType,
            this.state.taskType,
          )}
        </View>
        {this.state.taskType === TASK_TYPES.TIME ? (
          <View style={styles.formItemColumn}>
            <Text style={styles.formItemHeaderText}>
              Time Until Task (Days):
            </Text>
            {this.getTextInput(
              this.setTaskThreshold,
              true,
              this.state.threshold ? this.state.threshold.toString() : null,
              'ThresholdTextInput',
            )}
          </View>
        ) : null}
        {this.state.taskType === TASK_TYPES.DISTANCE ? (
          <View style={styles.formItemColumn}>
            <Text style={styles.formItemHeaderText}>
              Distance Until Task (km):
            </Text>
            {this.getTextInput(
              this.setTaskThreshold,
              true,
              this.state.threshold ? this.state.threshold.toString() : null,
              'ThresholdTextInput',
            )}
          </View>
        ) : null}
        <View style={styles.formItemRow}>
          <Text style={styles.formItemHeaderText}>Repeating?</Text>
          <CheckBox
            style={{marginLeft: 8}}
            value={this.state.isRepeating}
            onValueChange={this.setRepeatOption}
            tintColors={{true: Colors.accentBlue}}
            testID="RepeatBtn"
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.cancel}
            style={styles.cancelButton}
            testID="CancelTaskBtn">
            <Text style={styles.addTaskText}>Cancel</Text>
          </TouchableOpacity>
          {!this.state.isSaving ? (
            <TouchableOpacity
              onPress={this.save}
              style={styles.saveButton}
              testID="SaveTaskBtn">
              <Text style={styles.addTaskText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color={Colors.accentBlue} />
          )}
        </View>

        {Popup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  formItemColumn: {
    flexDirection: 'column',
    margin: 10,
  },

  formItemRow: {
    flexDirection: 'row',
    margin: 10,
  },

  buttonContainer: {
    marginTop: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },

  formItemHeaderText: {
    fontSize: 18,
    marginBottom: 5,
  },

  fixedItemText: {
    fontSize: 18,
    marginBottom: 5,
    color: Colors.grey,
    fontWeight: 'bold',
  },

  saveButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentBlue,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: 125,
    borderRadius: 10,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: Colors.accentLightBlue,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: 125,
    borderRadius: 10,
  },
  addTaskText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
});
