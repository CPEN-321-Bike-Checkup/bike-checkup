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
      });
  });
};

module.exports = SyncStrava;
