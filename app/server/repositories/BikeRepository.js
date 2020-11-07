const BikeModel = require('../schemas/Bike').BikeModel;
const UserModel = require('../schemas/User').UserModel;

class BikeRepository {
  constructor(bikeModel, userModel) {
    this.bikeModel = bikeModel;
    this.userModel = userModel;
  }

  getBikesForUser(userId) {
    //placeholder
    return this.bikeModel.find(query).exec();
  }
}
const bikeRepository = new BikeRepository(BikeModel, UserModel);
module.exports.BikeRepository = bikeRepository;
