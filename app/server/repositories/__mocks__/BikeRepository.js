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
        switch (userId) {
          case 1:
            resolve([bike1, bike2, bike3]);
            break;
          case 2:
            resolve([bike5]);
            break;
          case 3:
            resolve([bike6]);
            break;
          default:
            resolve([]);
            break;
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

const bike3 = {
  _id: 3,
  owner_id: 1,
  label: 'road bike',
  distance: 350,
};

const bike4 = {
  _id: 4,
  owner_id: 2,
  label: 'my road bike',
  distance: 500,
};

const bike5 = {
  _id: 5,
  owner_id: 2,
  label: 'Tom road bike',
  distance: 890,
};

//bike to overshoot predictions
const bike6 = {
  _id: 6,
  owner_id: 3,
  label: 'David road bike',
  distance: 1500,
};

var data = [bike1, bike2, bike3, bike4, bike5, bike6];

var bikeRepo = new BikeRepository(data);

module.exports = bikeRepo;
