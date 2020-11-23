// Error popup

import React from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';

export default errorPopup = function (text, pressCallback, visible) {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeaderText}>Error!</Text>
            <Text style={styles.modalText}>{text}</Text>

            <TouchableHighlight
              style={styles.okButton}
              onPress={() => {
                pressCallback();
              }}>
              <Text style={styles.textStyle}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  okButton: {
    backgroundColor: '#4787ff',
    borderRadius: 30,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    margin: 5,
  },
  modalHeaderText: {
    marginBottom: 8,
    textAlign: 'center',
    color: 'red',
    fontSize: 20,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
});
