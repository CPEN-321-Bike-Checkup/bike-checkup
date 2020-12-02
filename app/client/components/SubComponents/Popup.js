import React from 'react';
import {Modal, StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Colors} from '../../constants/Colors';

export default Popup = function (
  text,
  pressCallback,
  visible,
  errorPopup = true,
) {
  return (
    <View style={styles.centeredView}>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {errorPopup ? (
              <Text style={styles.modalHeaderText}>Error!</Text>
            ) : null}
            <Text style={styles.modalText}>{text}</Text>

            <TouchableHighlight
              style={styles.okButton}
              onPress={() => {
                pressCallback();
              }}
              testID="PopupOkBtn">
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
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  okButton: {
    backgroundColor: Colors.accentBlue,
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
