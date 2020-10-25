const Repository = require('./Repository');

const BikeModel = require('../schemas/Bike').BikeModel;

class BikeRepository extends Repository{

    constructor(bikeModel){
        super(bikeModel);
    }
}

const bikeRepository = new BikeRepository(BikeModel);
module.exports = bikeRepository;