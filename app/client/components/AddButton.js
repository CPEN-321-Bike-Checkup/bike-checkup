import React from 'react';
import {Text, TouchableOpacity, StyleSheet, View} from 'react-native';

export default AddButton = (onPress, testId) => {
  return (
    <View style={styles.openModalButtonContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.openModalButton}
        testID={testId}>
        <Text style={styles.openModalButtonIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  openModalButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '94%',
    alignItems: 'flex-end',
  },
  openModalButton: {
    backgroundColor: '#4787ff',
    width: 65,
    height: 65,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  openModalButtonIcon: {
    fontSize: 26,
    marginBottom: 3,
  },
});