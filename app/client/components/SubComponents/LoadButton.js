import React from 'react';
import {Text, TouchableHighlight, StyleSheet} from 'react-native';

export default LoadButton = (onPress) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      title="Load Next 30 days of History"
      style={styles.loadButton}>
      <Text style={styles.loadButtonText}>Load Next 30 days</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  loadButton: {
    backgroundColor: '#4787ff',
    padding: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  loadButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
