const Repository = require('./Repository');
const BikeModel = require('../schemas/Bike').BikeModel;
const UserModel = require('../schemas/User').UserModel;

class BikeRepository extends Repository {
  constructor(bikeModel, userModel) {
    super(bikeModel);
    this.userModel = userModel;
  }

  async GetBikesForUser(userId) {
    var user = await this.userModel.find({_id: userId}).exec();
    return user.bikes;
  }
}
const bikeRepository = new BikeRepository(BikeModel, UserModel);
module.exports = bikeRepository;
