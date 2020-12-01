const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class BikeRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['bikesForUser'] = 0;
  }

  GetBikesForUser(userId) {
    this.count['bikesForUser']++;
    return new Promise((resolve, reject) => {
      if (userId <= 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['bikesForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        if (userId == 1) {
          resolve(data);
        } else {
          resolve([]);
        }
      }
    });
  }
}

const bike1 = {
  _id: 1,
  owner_id: 1,
  label: 'my mountain bike',
  distance: 1500,
};

const bike2 = {
  _id: 2,
  owner_id: 1,
  label: 'my back-up bike',
  distance: 650,
};

var data = [bike1, bike2];

var bikeRepo = new BikeRepository(data);

module.exports = bikeRepo;
