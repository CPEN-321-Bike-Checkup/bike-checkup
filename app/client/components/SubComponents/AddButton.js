import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';

export default AddButton = (onPress, testId) => {
  return (
    <View style={styles.addButtonContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.addButton}
        testID={testId}>
        <Text style={styles.addButtonIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '94%',
    alignItems: 'flex-end',
  },
  addButton: {
    backgroundColor: '#61e7ff',
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonIcon: {
    fontSize: 26,
    marginBottom: 3,
  },
});
