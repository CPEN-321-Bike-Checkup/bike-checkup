const bikeRepository = require('../repositories/BikeRepository');

class BikeService {
  constructor(bikeRepository) {
    this.bikeRepository = bikeRepository;
  }

  // TODO: new bike created by importing from strava?
  async createBike(document) {
    this.bikeRepository.Create(document);
  }

  GetBikesForUser(userId) {
    return this.bikeRepository.GetBikesForUser(userId);
  }
}

const bikeService = new BikeService(bikeRepository);
module.exports = bikeService;
