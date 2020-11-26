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
import Autocomplete from 'react-native-autocomplete-input';
import ErrorPopup from '../ErrorPopup';

const BIKE_COMPONENTS_LIST = [
  'Front Wheel',
  'Rear Wheel',
  'Fork',
  'Handlebar',
  'Pedals',
  'Front Tire',
  'Rear Tire',
  'Bottom Bracket',
  'Front Brake',
  'Rear Brake',
  'Front Brake Pads',
  'Rear Brake Pads',
  'Front Brake Lever',
  'Rear Brake Lever',
  'Cassette',
  'Chainrings',
  'Crankset',
  'Front Derailleur',
  'Rear Derailleur',
  'Headset',
  'Saddle',
  'Seatpost',
  'Stem',
  'Front Brake Cable',
  'Rear Brake Cable',
  'Front Shifter Cable',
  'Rear Shifter Cable',
  'Shift Levers',
  'Front Shock',
  'Rear Shock',
  'Front Brake Rotor',
  'Rear Brake Rotor',
  'Helmet',
  'Cleats',
];

export default class AddComponentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      isError: false,
      errorText: null,
      fatalError: false,
      componentTypeInputText: '',
      componentNameInputText: '',
      /* Task Fields */
      bikeId: null,
      label: null,
    };
    this.navigation = props.navigation;
  }

  createComponent = (component) => {
    // TODO
  };

  updateComponent = (component) => {
    // TODO
  };

  setTaskTitle = (description) => {
    // TODO
  };

  setTaskType = (item) => {
    // TODO
  };

  cancel = () => {
    if (!this.state.isSaving) {
      this.navigation.goBack();
    }
  };

  save = () => {
    // TODO
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

  findBikeComponent = (inputText) => {
    if (inputText === '') return [];

    const regex = new RegExp(`${inputText.trim()}`, 'i');
    return BIKE_COMPONENTS_LIST.sort().filter(
      (component) => component.search(regex) >= 0,
    );
  }

  render() {
    const {componentTypeInputText} = this.state;
    const components = this.findBikeComponent(componentTypeInputText);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <ScrollView containerStyle={styles.formContainer} keyboardShouldPersistTaps='always'>
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Type:</Text>
          <Autocomplete
            autoCapitalize="words"
            autoCorrect={true}
            data={
              components.length >= 1 &&
              comp(componentTypeInputText, components[0])
                ? []
                : components
            }
            defaultValue={componentTypeInputText}
            onChangeText={(text) =>
              this.setState({componentTypeInputText: text})
            }
            placeholder="Enter..."
            renderItem={({item, i}) => (
              <TouchableOpacity
                onPress={() =>
                  this.setState({componentTypeInputText: item})
                }>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, i) => i.toString()}
            containerStyle={{height: 50}}
          />
        </View>

        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Name:</Text>
          <TextInput
            style={{
              paddingLeft: 6,
              fontSize: 16,
            }}
            placeholder="Enter..."
            placeholderTextColor="#616161"
            underlineColorAndroid="#000000"
            onChangeText={(text) =>
              this.setState({componentNameInputText: text})
            }
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
    color: '#666666',
    fontWeight: 'bold',
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
