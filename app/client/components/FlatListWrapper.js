// Creating wrappers for the SelectionList and FlatList will probably make things too convoluted
// Will likely be better to move duplicate screens code into common or utils file

import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native'

export let flatListWrapper = function (data, renderItem, testID) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => item + index}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
});