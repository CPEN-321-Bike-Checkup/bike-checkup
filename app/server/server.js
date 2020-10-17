const express = require('express');


const app = express();
const port = 5000;

const router = express.Router();
app.use(express.json());

app.listen(port, () => {
    console.log('Dir: ' + __dirname + ', Server is running on port: ' + port);
});




app.get('/time', function(req, res, next){
    var time = new Date();

    res.json({"time": time});
});