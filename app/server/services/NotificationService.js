const { google } = require('googleapis');
const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('../firebase.json');
const databaseURL = 'https://bike-checkup-c6e37.firebaseio.com';

var token = 'ckiJogkPRKyHyelqr-LKJf:APA91bEwN1Kvl-lx5YtIvT2k18P5JcUCbT9U1u99mr4qdW9qA5l48K3-4AUpI898aKU5kZaCFPS941wWFEBjr0eVBAvr23JUzUlUzQle1slfLxF9zhe1gRjHB1E0pmePRcIhdfbURg9r';

class NotificationService {
	constructor(admin, serviceAccount, databaseURL) {
		this.admin = admin;
		this.serviceAccount = serviceAccount;

		this.firebaseApp = admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
			databaseURL: databaseURL
		});

		this.messaging = this.firebaseApp.messaging();
	}

	CreateMessage(name, title, body, data, deviceToken) {
		var message = {
			'name': name,
			'data': data,
			'notification': {
				'title': title,
				'body': body,
			},
			'android': {
				notification: {

				},
				'data': data,
			},
			'token': deviceToken
		};
		return message;
	}

	SendNotification(message) {
		this.messaging.send(message)
	}
}

const notificationService = new NotificationService(admin, serviceAccount, databaseURL);
module.exports = notificationService;