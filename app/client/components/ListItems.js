import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


export let ListItem = ({ item }) => {
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.title}>{item.task}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View>
        <Text style={styles.bike}>{item.bike}</Text>
      </View>
    </View>
  );
};

export let EditableListItem = ({ item, editMode, onRemovePress }) => {
  console.log('Item editMode:')
  console.log(editMode);
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {editMode ?
          <TouchableOpacity onPress={onRemovePress}>
            <MaterialIcons name="remove-circle" color={'red'} size={24} />
          </TouchableOpacity>
          : null}
        <Text style={styles.title}>{item.task}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
};


export let PressableListItem = ({ title, onPress, testID }) => {
  return (
    <TouchableHighlight
      style={styles.touchableItem}
      onPress={onPress}
      underlayColor="gainsboro"
      testID={testID}
    >
      <View style={styles.itemViewWrapper}>
        <Text style={styles.itemText}>{title}</Text>
        <MaterialIcons name="arrow-forward-ios" color={'grey'} size={24} style={styles.itemIcon} />
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
    fontSize: 20,
    fontWeight: 'bold'
  },
  date: {
    fontSize: 18,
  },
  bike: {
    fontSize: 16,
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },

  touchableItem: {
    backgroundColor: 'white',
    padding: 18
  },
  itemViewWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 20,
    flex: 15
  },
  itemIcon: {
    flex: 1
  }
});