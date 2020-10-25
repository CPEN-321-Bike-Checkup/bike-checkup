const BikeModel = require('../schemas/Bike').BikeModel;
const UserModel = require('../schemas/User').UserModel;

class BikeRepository{

    constructor(bikeModel, userModel){
        this.bikeModel = bikeModel;
        this.userModel = userModel;
    }

    getBikes(query){
        //mongoose model is used like a repository
        return this.bikeModel.find(query).exec();
    }

    getOwner(bike){
        return this.userModel.findById(bike.owner).exec();
    }
}


const bikeRepository = new BikeRepository(BikeModel, UserModel);
module.exports.BikeRepository = bikeRepository;