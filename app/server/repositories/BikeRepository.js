const Repository = require('./Repository');
const BikeModel = require('../schemas/Bike').BikeModel;
const UserModel = require('../schemas/User').UserModel;

class BikeRepository extends Repository {
  constructor(bikeModel, userModel) {
    super(bikeModel);
    this.userModel = userModel;
  }

  GetBikesForUser(userId) {
    return this.documentModel.find({owner: userId}).exec();
  }
}
const bikeRepository = new BikeRepository(BikeModel, UserModel);
module.exports = bikeRepository;
