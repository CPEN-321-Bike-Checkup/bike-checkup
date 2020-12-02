const bikeRepository = require('../repositories/BikeRepository');

class BikeService {
  constructor(bikeRepository) {
    this.bikeRepository = bikeRepository;
  }

  CreateBike(document) {
    return this.bikeRepository.Create(document);
  }

  GetBikesForUser(userId) {
    return this.bikeRepository.GetBikesForUser(userId);
  }

  GetAllBikes() {
    return this.bikeRepository.GetAll();
  }
}

const bikeService = new BikeService(bikeRepository);
module.exports = bikeService;
