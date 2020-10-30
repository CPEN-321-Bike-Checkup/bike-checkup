const express = require('express');
const bikeService = require('../services/BikeService');


const initBikeRouting = (app) => {

	const bikeRouter = express.Router();

	app.use('/bike', bikeRouter);
	
	bikeRouter.post('/', (req, res, next) => {

        var resp = bikeService.CreateBikes(req.data);
		res.send(resp);
	});

	bikeRouter.get('/:ownerId', (req, res, next) => {

        var bikes = bikeService.GetUsersBikes(req.params[0]);
        console.log(JSON.stringify(bikes))
		res.send(JSON.stringify(bikes));
	});

}

module.exports = initBikeRouting;