import React from 'react';
import {
  ScrollView,
  View,
  TextInput,
  StyleSheet,
  Modal,
  Text,
  TouchableHighlight,
} from 'react-native';
import {Dropdown} from 'react-native-material-dropdown';

export default class AddTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maintenanceData: [],
      editMode: false,
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

  render() {
    const {modalVisible} = this.state;
    //   return (
    //     <View style={styles.centeredView}>
    //       <Modal
    //         animationType="slide"
    //         transparent={true}
    //         visible={modalVisible}
    //         onRequestClose={() => {
    //           Alert.alert('Modal has been closed.');
    //         }}>
    //         <View style={styles.centeredView}>
    //           <View style={styles.modalView}>
    //             <Text style={styles.modalText}>Hello World!</Text>

    //             <TouchableHighlight
    //               style={{...styles.openButton, backgroundColor: '#2196F3'}}
    //               onPress={() => {
    //                 this.setModalVisible(!modalVisible);
    //               }}>
    //               <Text style={styles.textStyle}>Hide Modal</Text>
    //             </TouchableHighlight>
    //           </View>
    //         </View>
    //       </Modal>

    //       <TouchableHighlight
    //         style={styles.openButton}
    //         onPress={() => {
    //           this.setModalVisible(true);
    //         }}>
    //         <Text style={styles.textStyle}>Show Modal</Text>
    //       </TouchableHighlight>
    //     </View>
    //   );

    return;
    <View style={styles.formContainer}>
      <FormItem>
        <Text>Bike:</Text>
        <Dropdown></Dropdown>
      </FormItem>
    </View>;
  }
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  formItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
