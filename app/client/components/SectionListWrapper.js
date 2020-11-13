// Creating wrappers for the SelectionList and FlatList will probably make things too convoluted
// Will likely be better to move duplicate screens code into common or utils file

import React from 'react';
import {SectionList, StyleSheet, Text, View} from 'react-native';

export let selectionListWrapper = (data, renderItem) => {
  return (
    <SectionList
      sections={data}
      keyExtractor={(item, index) => item + index}
      renderItem={renderItem} // item = item in the list (i.e. string)
      renderSectionHeader={({section: {title}}) => (
        <Text style={styles.headerText}>{title}</Text>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    backgroundColor: 'tomato',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    borderTopColor: 'black',
    borderTopWidth: 2,
    paddingBottom: 4,
    paddingTop: 7,
    paddingLeft: 5
  },
  separator: {
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
});
