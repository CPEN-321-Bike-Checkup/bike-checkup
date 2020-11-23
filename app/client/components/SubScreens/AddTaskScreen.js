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
import ErrorPopup from '../ErrorPopup';

const TASK_TYPES = {
  TIME: 0,
  DISTANCE: 1,
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
      bike: null,
      component: null,
      title: null,
      taskType: null,
      threshold: null,
      isRepeating: false,
    };
    this.navigation = props.navigation;
    this.newTask = props.route.params.newTask; // boolean for update or new
    this.taskData = props.route.params.taskData; // TODO: get all availabe task data if not new
  }

  componentDidMount() {
    if (!this.props.fixedBike) {
      this.updateBikeList();
    }
  }

  transformBikeList = (bikes) => {
    let bikesList = [];
    for (let bike of bikes) {
      console.log(bike);
      console.log(bike.label);
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
    fetch(`http://${global.serverIp}:5000/bike/${global.userId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((bikes) => {
        console.log('GOT BIKES:');
        console.log(bikes);
        this.setState({bikeList: this.transformBikeList(bikes)});
      })
      .catch((error) => {
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
    fetch(`http://${global.serverIp}:5000/component/${bikeId}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((components) => {
        console.log('GOT COMPONENTS:');
        console.log(components);

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
      })
      .catch((error) => {
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

  getDropDownPicker(data, onChangeCallback) {
    return (
      <DropDownPicker
        style={{flex: 1}}
        items={data}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        placeholder="Select..."
        placeholderStyle={{color: '#616161', fontSize: 16}}
        selectedLabelStyle={{color: 'black', fontSize: 16}}
        containerStyle={{height: 50}}
        onChangeItem={(item) => onChangeCallback(item)}
      />
    );
  }

  getTextInput(onTextCallback, numeric = false) {
    const keyboard = numeric ? 'numeric' : 'default';
    return (
      <TextInput
        placeholder="Enter..."
        placeholderTextColor="#616161"
        underlineColorAndroid="#000000"
        keyboardType={keyboard}
        onChangeText={onTextCallback}
        style={{
          paddingLeft: 6,
          fontSize: 16,
        }}></TextInput>
    );
  }

  getBikeFormItem = () => {
    const {fixedBike} = this.props.route.params;
    if (fixedBike) {
      return (
        <View style={styles.formItemRow}>
          <Text style={styles.formItemHeaderText}>Bike: </Text>
          <Text style={styles.fixedItemText}>{fixedBike}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Bike:</Text>
          {this.getDropDownPicker(this.state.bikeList, this.setBike)}
        </View>
      );
    }
  };

  getComponentFormItem = () => {
    const {fixedComponent} = this.props.route.params;
    if (fixedComponent) {
      return (
        <View style={styles.formItemRow}>
          <Text style={styles.formItemHeaderText}>Component: </Text>
          <Text style={styles.fixedItemText}>{fixedComponent}</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Component:</Text>
          {this.getDropDownPicker(this.state.componentList, this.setComponent)}
        </View>
      );
    }
  };

  setBike = (item) => {
    this.setState({bike: item.value});

    // Fetch the bike's components
    this.updateComponentList(item.value);
  };

  setComponent = (item) => {
    this.setState({component: item.value});
  };

  setTaskTitle = (taskTitle) => {
    this.setState({title: taskTitle});
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

    let {bike, component, taskType, threshold} = this.state;

    // Check for form errors
    let errorText = null;
    if (bike == null) {
      errorText = 'Please select a bike.';
    } else if (component == null) {
      errorText = 'Please select a component.';
    } else if (taskType == null) {
      errorText = 'Please select a task type (distance or time).';
    } else if (threshold == null) {
      errorText = 'Please enter a threshold.';
    }

    if (errorText) {
      this.setState({
        isError: true,
        errorText: errorText,
      });
      return;
    }

    let newTask = {
      bike: this.state.bike,
      component: this.state.component,
      title: this.state.title,
      taskType: this.state.taskType,
      threshold: this.state.threshold,
      isRepeating: this.state.isRepeating,
    };

    // POST task to database
    fetch(`http://${global.serverIp}:5000/maintenanceTask/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        // TODO: check response status
        // TODO: make sure back-end makes prediction for task before responding
        console.log('SUCCESSFULLY SAVED TASK');
        this.navigation.goBack();
      })
      .catch((error) => {
        // Display error popup
        this.setState({
          isError: true,
          errorText: 'Failed to save task. Check network connection.',
        });

        console.error(error);
      })
      .finally(() => {});
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
      <ScrollView containerStyle={styles.formContainer}>
        {this.getBikeFormItem()}
        {this.getComponentFormItem()}
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Title:</Text>
          {this.getTextInput(this.setTaskTitle)}
        </View>
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Type:</Text>
          {this.getDropDownPicker(TASK_TYPE_DATA, this.setTaskType)}
        </View>
        {this.state.taskType === TASK_TYPES.TIME ? (
          <View style={styles.formItemColumn}>
            <Text style={styles.formItemHeaderText}>
              Time Until Task (Days):
            </Text>
            {this.getTextInput(this.setTaskThreshold, true)}
          </View>
        ) : null}
        {this.state.taskType === TASK_TYPES.DISTANCE ? (
          <View style={styles.formItemColumn}>
            <Text style={styles.formItemHeaderText}>
              Distance Until Task (km):
            </Text>
            {this.getTextInput(this.setTaskThreshold, true)}
          </View>
        ) : null}
        <View style={styles.formItemRow}>
          <Text style={styles.formItemHeaderText}>Repeating?</Text>
          <CheckBox
            style={{marginLeft: 8}}
            value={this.state.isRepeating}
            onValueChange={this.setRepeatOption}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.cancel}
            style={styles.cancelButton}
            testID="SaveBtn">
            <Text style={styles.addTaskText}>Cancel</Text>
          </TouchableOpacity>
          {!this.state.isSaving ? (
            <TouchableOpacity
              onPress={this.save}
              style={styles.saveButton}
              testID="CancelBtn">
              <Text style={styles.addTaskText}>Save</Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator size="large" color="#47ffbf" />
          )}
        </View>

        {ErrorPopup(
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
    color: 'grey',
  },

  saveButton: {
    alignItems: 'center',
    backgroundColor: '#47ffbf',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    width: 125,
    borderRadius: 10,
  },
  cancelButton: {
    alignItems: 'center',
    backgroundColor: '#beffe8',
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
