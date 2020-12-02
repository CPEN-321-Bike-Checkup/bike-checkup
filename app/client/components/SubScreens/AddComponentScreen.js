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
import Popup from '../SubComponents/Popup';
import {timeout} from '../ScreenUtils';
import {Colors} from './../../constants/Colors'

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
  'Chain',
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
      /* Component Fields */
      componentId: null,
      componentType: '',
      componentName: '',
    };
    this.navigation = props.navigation;

    // Params
    this.bike = props.route.params.bike;
    this.isNewComponent = props.route.params.isNewComponent; // Boolean for update or new
    if (!this.isNewComponent) {
      var component = props.route.params.component;
      var componentTitles = component.title.split(': ');
      this.state.componentType = componentTitles[0];
      this.state.componentName = componentTitles[1];
      this.state.componentId = component.id;
    }
  }

  cancel = () => {
    if (!this.state.isSaving) {
      this.navigation.goBack();
    }
  };

  save = () => {
    this.setState({isSaving: true});
    let {componentType, componentName} = this.state;

    // Check for and handle any form errors
    let errorText = null;
    if (!componentType) {
      errorText = 'Please select a component type.';
    }
    if (errorText) {
      this.setState({
        isError: true,
        errorText: errorText,
      });
      return;
    }

    // Save component to db
    let component = {
      bike_id: this.bike.id,
      label: componentName
        ? componentType + ': ' + componentName
        : componentType, // TODO: See if we can change schema to have type and optional name
      attachment_date: Date.now(), // TODO: Check this is the format BE needs
    };

    if (this.isNewComponent) {
      this.createComponent(component);
    } else {
      component._id = this.state.componentId;
      this.updateComponent(component);
    }
  };

  updateComponent = (component) => {
    // Send PUT request
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(component),
      }).then((response) => {
        // TODO: check response status
        console.log('Successfully updated component');
        this.navigation.goBack();
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to update component. Check network connection.',
      });

      console.error(error);
    });
  };

  createComponent = (newComponent) => {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComponent),
      }).then((response) => {
        console.log('Successfully saved component');
        this.navigation.goBack();
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText: 'Failed to save component. Check network connection.',
      });
      console.error(error);
    });
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
  };

  render() {
    const {componentType} = this.state;
    const components = this.findBikeComponent(componentType);
    const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

    return (
      <ScrollView
        containerStyle={styles.formContainer}
        keyboardShouldPersistTaps="always">
        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Type:</Text>
          <Autocomplete
            autoCapitalize="words"
            autoCorrect={true}
            data={
              components.length >= 1 && comp(componentType, components[0])
                ? []
                : components
            }
            defaultValue={componentType}
            onChangeText={(text) => this.setState({componentType: text})}
            placeholder="Enter..."
            renderItem={({item, i}) => (
              <TouchableOpacity
                onPress={() => this.setState({componentType: item})}>
                <Text style={styles.itemText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, i) => i.toString()}
            testID="ComponentTypeAutoComplete"
          />
        </View>

        <View style={styles.formItemColumn}>
          <Text style={styles.formItemHeaderText}>Name (Optional):</Text>
          <TextInput
            style={{
              paddingLeft: 6,
              fontSize: 16,
            }}
            defaultValue={this.state.componentName}
            placeholder="Enter..."
            placeholderTextColor={Colors.grey}
            underlineColorAndroid={Colors.black}
            onChangeText={(text) => this.setState({componentName: text})}
            testID="ComponentNameTextInput"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.cancel}
            style={styles.cancelButton}
            testID="CancelComponentBtn">
            <Text style={styles.addText}>Cancel</Text>
          </TouchableOpacity>

          {!this.state.isSaving ? (
            <TouchableOpacity
              onPress={this.save}
              style={styles.saveButton}
              testID="SaveComponentBtn">
              <Text style={styles.addText}>Save</Text>
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
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  formContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  formItemColumn: {
    flexDirection: 'column',
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
  addText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'black',
  },
});
