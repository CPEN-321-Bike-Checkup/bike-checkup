import axios from 'axios';
import PushNotification from 'react-native-push-notification';

const SyncStrava = (userId) => {
  return new Promise((resolve, reject) => {
    console.log('Post user id', userId);
    axios
      .post(
        'http://' +
          global.serverIp +
          ':5000/strava/' +
          userId +
          '/connectedStrava',
        {
          _id: userId,
        },
      )
      .then((resp) => {
        resolve();
        console.log('Successfully Synced with Strava');
        PushNotification.configure({
          onRegister: (tokenData) => {
            console.log('Remote notification token: ', tokenData);
            axios
              .post('http://' + global.serverIp + ':5000/user/registerDevice', {
                userId: global.userId,
                token: tokenData.token,
              })
              .then((res) => {
                console.log('Registered device');
              })
              .catch((err) => {
                console.log('Failed to register device: ', err);
              });
          },

          onNotification: (notification) => {
            console.log('Remote notification received: ', notification);
          },
          senderID: global.senderID,
          popInitialNotification: false,
          requestPermissions: true,
        });
      });
  });
};

module.exports = SyncStrava;
