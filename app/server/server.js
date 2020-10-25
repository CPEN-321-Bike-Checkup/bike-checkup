//const { ObjectID } = require('bson');
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require('body-parser');
const url = "mongodb://localhost:27017/bikeCheckupDb";


const app = express();
const port = 5000;

const router = express.Router();
app.use(express.json());



/*
MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology:true}, (err, client) => {
    db = client.db("list");
});
*/
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology:true});
let db = mongoose.connection;

//check connection
db.once('open', function() {
    console.log('Connected to MongoDB - bikedb');
});

//check DB errors, print if any
db.on('error', function(err) {
    console.log(err);
});

//bring in models
let User = require('./schemas/User').UserModel;
let Bike = require('./schemas/Bike').BikeModel;
let Component = require('./schemas/Component').ComponentModel;
let Activity = require('./schemas/Activity').ActivityModel;
let ComponentActivity = require('./schemas/ComponentActivity').ComponentActivityModel;
let MaintenanceItem = require('./schemas/MaintenanceItem').MaintenanceItemModel;
let MaintenanceSchedule = require('./schemas/MaintenanceSchedule').MaintenanceScheduleModel;


var token = 'ckiJogkPRKyHyelqr-LKJf:APA91bEwN1Kvl-lx5YtIvT2k18P5JcUCbT9U1u99mr4qdW9qA5l48K3-4AUpI898aKU5kZaCFPS941wWFEBjr0eVBAvr23JUzUlUzQle1slfLxF9zhe1gRjHB1E0pmePRcIhdfbURg9r';
let notificationService = require('./services/NotificationService').notificationService;

app.post('/notification', function(req, res, next){
	var message = notificationService.CreateMessage("Test Notification Name", 'Test Notification', 'This is a notification', {}, token);
	notificationService.SendNotification(message);
	
	res.send('notification sent');
});

app.listen(port, () => {
    console.log('Dir: ' + __dirname + ', Server is running on port: ' + port);
});


app.post('/bike', function(req, res, next){
    Bike.create(req.body, function(err, bike){
        if (err){
            console.error(err);
            res.sendStatus(err);
        } else{
            console.log('Bike ', req.body);
            res.sendStatus('Saved Bike');
        }
        
    });


});


app.post('/user', function(req, res, next){
    User.create(req.body, function(err, user){
        if (err){
            console.error(err);
            res.sendStatus(err);
        } else{
            console.log('Bike ', req.body);
            res.sendStatus('Saved User');
        }
        
    });


});











app.get('/time', function(req, res, next) {
    var time = new Date();

    res.json({"time": time});
});

app.get('/', function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            console.log(err);
        }
    });
    res.send(users);
});
    


app.get('/list', function(req, res, next) {
    db.collection("list").find().toArray((err, result) => {

        res.send(result);
    });
});

app.post("/list", function (req, res) {
    console.log(req.body.task);
    var row = {
        task: req.body.task,
        info: req.body.info
    };
    db.collection('list').insertOne(row, 
        (err, request) => {
            if (err) {
                return console.log(err);
            }
            else {
                res.send("saved \n");
            }
        });
});

app.put("/list", function (req, res) {
    console.log(req.body.task);
    var row = {
        task: req.body.task,
        $set: {info: req.body.info}
    };
    db.collection('list').updateOne(
        {task: req.body.task},
        {$set: {info:req.body.info}}, 
        (err, request) => {
            if (req.body.task == null || req.body.info == null) {
                res.status(400).send("Invalid task or info");
                return;
            }
            if (err) {
                return console.log(err);
            }
            else {
                res.send("updated \n");
            }
        });
});