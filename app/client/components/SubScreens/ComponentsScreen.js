import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {RemovablePressableListItem} from '../SubComponents/ListItems';
import {flatListWrapper} from '../SubComponents/FlatListWrapper';
import CommonStyles from '../CommonStyles';
import AddButton from '../SubComponents/AddButton';
import Popup from '../SubComponents/Popup';
import {timeout} from '../ScreenUtils';

const FETCH_IN_PROGRESS = 0;
const FETCH_SUCCEEDED = 1;
const FETCH_FAILED = 2;

export default class ComponentsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentData: [],
      editMode: false,
      modalVisible: false,
      componentTypeInputText: '',
      componentNameInputText: '',
      nextId: 0,
      isError: false,
      errorText: null,
      fetchState: FETCH_IN_PROGRESS,
    };
    this.navigation = props.navigation;
    this.bike = props.route.params.bike;
    this.componentsToDeleteIds = [];
    this.itemCount = 0;
  }

  componentDidMount() {
    this.getComponents();

    // Re-fetch data every time screen comes into focus
    this._unsubscribe = this.navigation.addListener('focus', () => {
      this.getComponents();
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

  getComponents() {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component/${this.bike.id}`, {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((components) => {
          console.log('Got components', components);
          this.setState({
            componentData: this.transformComponentData(components),
            fetchState: FETCH_SUCCEEDED,
          });
        }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to retrieve your components. Check network connection.',
        fetchState: FETCH_FAILED,
      });

      console.error(error);
    });
  }

  deleteComponents(components) {
    timeout(
      3000,
      fetch(`http://${global.serverIp}:5000/component`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(components),
      }).then((components) => {
        // TODO: check response status
        console.log('Successfully deleted components: ', components);
      }),
    ).catch((error) => {
      // Display error popup
      this.setState({
        isError: true,
        errorText:
          'Failed to delete your components. Check network connection.',
      });

      // Re-fetch components
      this.getComponents();

      console.error(error);
    });
  }

  transformComponentData = (components) => {
    let componentsList = [];
    for (let component of components) {
      let newComponent = {
        title: component.label,
        id: component._id,
      };
      componentsList.push(newComponent);
    }
    return componentsList;
  };

  onErrorAccepted = () => {
    // Clear error state
    this.setState({
      isError: false,
      errorText: null,
    });
  };

  sendComponentToBeDeleted(id) {
    return () => {
      let newComponentData = [...this.state.componentData];
      for (var i = 0; i < newComponentData.length; i++) {
        if (newComponentData[i].id == id) {
          let component = newComponentData.splice(i, 1)[0];
          this.componentsToDeleteIds.push({_id: component.id}); // Remember removed component IDs
          this.setState({componentData: newComponentData});
        }
      }
    };
  }

  // Note: arrow function needed to bind correct context
  toggleEditMode = () => {
    if (this.state.editMode) {
      if (this.componentsToDeleteIds.length != 0) {
        this.deleteComponents(this.componentsToDeleteIds);
      }
      this.componentsToDeleteIds = [];
    }

    this.setState({editMode: this.state.editMode ? false : true});
  };

  renderItem = ({item}) => {
    const testId = 'ComponentListItem' + this.itemCount;
    this.itemCount++;
    // Reset here as list may be re-rendered w/o call to render()
    if (this.itemCount == this.state.componentData.length) {
      this.itemCount = 0;
    }

    if (this.state.editMode) {
      return (
        <RemovablePressableListItem
          title={item.title}
          editMode={this.state.editMode}
          onPress={() => {
            this.navigation.navigate('Add Component', {
              isNewComponent: false,
              bike: this.bike,
              component: item,
            });
          }}
          onRemovePress={this.sendComponentToBeDeleted(item.id)}
          testID={testId}
        />
      );
    } else {
      return (
        <RemovablePressableListItem
          title={item.title}
          editMode={this.state.editMode}
          onPress={() => {
            this.navigation.navigate('Tasks', {
              bike: this.bike,
              component: item,
            });
          }}
          onRemovePress={this.sendComponentToBeDeleted(item.id)}
          testID={testId}
        />
      );
    }


  };

  render() {
    let mainView = null;

    if (this.state.fetchState == FETCH_FAILED) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text>Error fetching components.</Text>
        </View>
      );
    } else if (this.state.componentData.length > 0) {
      mainView = flatListWrapper(
        this.state.componentData,
        this.renderItem,
        'ComponentsList',
      );
    } else if (this.state.fetchState != FETCH_IN_PROGRESS) {
      mainView = (
        <View style={CommonStyles.fetchFailedView}>
          <Text style={CommonStyles.emptyStateText}>{this.bike.title} has no components.{"\n"}Click on the add button to add a new component.</Text>
        </View>
      );
    }

    return (
      <View style={{flex: 1}}>
        {mainView}

        {AddButton(() => {
          this.navigation.navigate('Add Component', {
            isNewComponent: true,
            bike: this.bike,
          });
        }, 'AddComponentBtn')}

        {Popup(
          this.state.errorText,
          this.onErrorAccepted,
          this.state.isError,
        )}
      </View>
    );
  }
}
