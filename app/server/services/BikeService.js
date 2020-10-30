const bikeRepository = require('../repositories/BikeRepository');

class BikeService{

	constructor(bikeRepository){
		this.bikeRepository = bikeRepository;
	}

	GetUsersBikes(userId){
        return this.bikeRepository.GetUsersBikes(userId);
	}
	
	CreateBikes(bikes){
		return this.bikeRepository.Create(user);
	}	
}

const bikeService = new BikeService(bikeRepository);
module.exports = bikeService;