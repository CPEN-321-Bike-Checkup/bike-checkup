import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import CheckBox from '@react-native-community/checkbox';

const TASK_TYPES = {
  TIME: 0,
  DISTANCE: 1,
};

const PLACEHOLDER_DATA = [
  {label: 'Item 1', value: 'item1'},
  {label: 'Item 2', value: 'item2'},
];

const TASK_TYPE_DATA = [
  {label: 'Time', value: TASK_TYPES.TIME},
  {label: 'Distance', value: TASK_TYPES.DISTANCE},
];

export default class AddTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceData: [],
      editMode: false,
      bike: null,
      component: null,
      taskType: null,
      isRepeating: false,
      isSaving: false,
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
  }

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

  getTextInput(numeric = false) {
    const keyboard = numeric ? 'numeric' : 'default';
    return (
      <TextInput
        placeholder="Enter..."
        placeholderTextColor="#616161"
        underlineColorAndroid="#000000"
        keyboardType={keyboard}
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
    console.log(item);
    this.setState({bike: item.value});
  };

  setComponent = (item) => {
    console.log(item);
    this.setState({component: item.value});
  };

  setTaskType = (item) => {
    console.log(item);
    this.setState({taskType: item.value});
  };

  setRepeatOption = (newVal) => {
    this.setState({isRepeating: newVal});
  };

  cancel = () => {
    this.navigation.navigate('Tasks');
  };

  save = () => {
    this.setState({isSaving: true});

    // POST task to database
    fetch('3.97.53.16:8080/tasks/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstParam: 'yourValue',
        secondParam: 'yourOtherValue',
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.updateMaintenanceData({dateJSON: data});
      })
      .catch((error) => {
        // this.setState({dateJSON: 'Error fetching data'})
        console.error(error);
      })
      .finally(() => {
        // this.setState({ isLoading: false });
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
          <Text style={styles.formItemHeaderText}>Name:</Text>
          {this.getTextInput()}
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
            {this.getTextInput()}
          </View>
        ) : null}
        {this.state.taskType === TASK_TYPES.DISTANCE ? (
          <View style={styles.formItemColumn}>
            <Text style={styles.formItemHeaderText}>
              Distance Until Task (km):
            </Text>
            {this.getTextInput(true)}
          </View>
        ) : null}
        <View style={styles.formItemRow}>
          <Text style={styles.formItemHeaderText}>Repeating?</Text>
          <CheckBox
            style={{marginLeft: 8}}
            value={this.state.isRepeating}
            onValueChange={(newValue) => this.setRepeatOption(newValue)}
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
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
  // modalView: {
  //   margin: 20,
  //   backgroundColor: 'white',
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  // openButton: {
  //   backgroundColor: '#F194FF',
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  // },
  // modalText: {
  //   marginBottom: 15,
  //   textAlign: 'center',
  // },
});

//   render() {
//     return (
//       <View style={styles.inputContainer} testID="AddTaskScreen">
//         <TextInput
//           style={styles.textInput}
//           placeholder="Your name"
//           maxLength={20}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },
//   button: {
//     alignItems: 'center',
//     backgroundColor: '#DDDDDD',
//     padding: 10,
//   },
//   countContainer: {
//     alignItems: 'center',
//     padding: 10,
//   },
// });
