const bikeRepository = require('../repositories/BikeRepository');

class BikeService {
  constructor(bikeRepository) {
    this.bikeRepository = bikeRepository;
  }

  // TODO: new bike created by importing from strava?
  async createBike(document) {
    this.bikeRepository.Create(document);
  }

  getBikes(userId) {
    //debugging bike route
    /*
    console.log('hello bikes!');

    const bike1 = {
      bike_id: 1,
      bike_name: 'bike 1',
    };
    var bikes = [bike1];
    return bikes;
    */

    return bikeRepository.GetBikesForUser(userId);
  }
}

const bikeService = new BikeService(bikeRepository);
module.exports = bikeService;
