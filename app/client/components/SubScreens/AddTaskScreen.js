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

const PLACEHOLDER_DATA = [
  {label: 'Item 1', value: 'item1'},
  {label: 'Item 2', value: 'item2'},
];

const BIKE_DATA = [];

const COMPONENT_DATA = [];

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

    if (!this.props.fixedBike) {
      getBikeList();
    }
  }

  getBikeList = () => {};

  getComponentList = () => {};

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
          {this.getDropDownPicker(PLACEHOLDER_DATA, this.setBike)}
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
          {this.getDropDownPicker(PLACEHOLDER_DATA, this.setComponent)}
        </View>
      );
    }
  };

  setBike = (item) => {
    this.setState({bike: item.value});

    // Fetch the bike's components
    this.getComponentList(item.value)
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
      this.navigation.navigate('Tasks');
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
    fetch(`${global.serverIp}/maintenanceTask/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        this.updateMaintenanceData({dateJSON: data});
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
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
      isSaving: false,
    });
  };

  render() {
    const {modalVisible} = this.state;

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
