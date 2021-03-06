import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const ListItem = ({title, subText, rightText}) => {
  return (
    <View style={styles.item}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.rightText}>{rightText}</Text>
      </View>
      <View>
        <Text style={styles.subText}>{subText}</Text>
      </View>
    </View>
  );
};

export const RemovableListItem = ({title, editMode, onRemovePress}) => {
  return (
    <TouchableHighlight style={styles.touchableItem} underlayColor="gainsboro">
      <View style={styles.itemViewWrapper}>
        {editMode ? (
          <TouchableOpacity style={styles.removeIcon} onPress={onRemovePress}>
            <MaterialIcons name="remove-circle" color={'red'} size={24} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.itemText}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
};

export const CompletableListItem = ({
  title,
  subText,
  rightText,
  editMode,
  onCompletePress,
  testID,
}) => {
  return (
    <View style={styles.item}>
      <View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.title}>{title}</Text>
          {editMode ? (
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={onCompletePress}
              testID={testID + 'CompleteBtn'}>
              <MaterialIcons name="check-circle" color={'green'} size={24} />
            </TouchableOpacity>
          ) : (
            <Text style={styles.rightText}>{rightText}</Text>
          )}
        </View>
        <View>
          <Text style={styles.subText}>{subText}</Text>
        </View>
      </View>
    </View>
  );
};

export const PressableListItem = ({title, onPress, testID}) => {
  return (
    <TouchableHighlight
      style={styles.touchableItem}
      onPress={onPress}
      underlayColor="gainsboro"
      testID={testID}>
      <View style={styles.itemViewWrapper}>
        <Text style={styles.itemText}>{title}</Text>
        <MaterialIcons
          name="arrow-forward-ios"
          color={'grey'}
          size={24}
          style={styles.itemIcon}
        />
      </View>
    </TouchableHighlight>
  );
};

export const RemovablePressableListItem = ({
  title,
  editMode,
  onRemovePress,
  onPress,
  testID,
}) => {
  return (
    <TouchableHighlight
      style={styles.touchableItem}
      onPress={onPress}
      underlayColor="gainsboro"
      testID={testID}>
      <View style={styles.itemViewWrapper}>
        {editMode ? (
          <TouchableOpacity
            style={styles.removeIcon}
            onPress={onRemovePress}
            testID={testID + 'RemoveBtn'}>
            <MaterialIcons name="remove-circle" color={'red'} size={24} />
          </TouchableOpacity>
        ) : null}
        <Text style={styles.itemText}>{title}</Text>
        <MaterialIcons
          name="arrow-forward-ios"
          color={'grey'}
          size={24}
          style={styles.itemIcon}
        />
      </View>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    padding: 18,
  },
  title: {
    maxWidth: '70%',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightText: {
    fontSize: 18,
  },
  subText: {
    fontSize: 16,
  },
  touchableItem: {
    backgroundColor: 'white',
    padding: 18,
  },
  itemViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    flex: 15,
  },
  itemIcon: {
    flex: 1,
  },
  removeIcon: {
    paddingRight: 5,
  },
});
