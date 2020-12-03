import {StyleSheet} from 'react-native';

let CommonStyles = StyleSheet.create({
  editButtonText: {
    fontSize: 15,
    color: 'black',
    padding: 10,
    fontWeight: 'bold',
  },
  fetchFailedView: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    paddingHorizontal: 10,
    fontSize: 16,
  },
});

export default CommonStyles;
