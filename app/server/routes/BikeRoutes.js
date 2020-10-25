const express = require('express');
const bikeService = require('../services/BikeService');


const initBikeRouting = (app) => {

	const bikeRouter = express.Router();

	app.use('/bike', bikeRouter);

	bikeRouter.get('', (req, res, next) => {
        var bikes = bikeService.getBikesByUserId(69);
        console.log(JSON.stringify(bikes))
		res.send(JSON.stringify(bikes));
	});

}

module.exports = initBikeRouting;