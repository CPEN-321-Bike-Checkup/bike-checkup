const admin = require('firebase-admin');
const axios = require('axios');
const fs = require('fs');

const serviceAccount = require("../firebase.json");

function NotificationService(){

    this.admin = admin;

    this.admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://bike-checkup-c6e37.firebaseio.com"
    });
        


    this.SendNotification = (message) => {
        axios.post('https://fcm.googleapis.com/v1/{parent=projects/' + serviceAccount.project_id + '}/messages:send', {
            message: message       
        }).then((res) => {
            console.log('status: ' + res.statusCode);     
        }).catch((error) => {
            console.error(error);
        });
    }

    
    
    this.GetAccessToken = () => {
      return new Promise(function(resolve, reject) {
        const key = require('../placeholders/service-account.json');
        const jwtClient = new google.auth.JWT(
          key.client_email,
          null,
          key.private_key,
          SCOPES,
          null
        );
        jwtClient.authorize(function(err, tokens) {
          if (err) {
            reject(err);
            return;
          }
          resolve(tokens.access_token);
        });
      });
    }
    
    return this;
}
exports.NotificationService = NotificationService();