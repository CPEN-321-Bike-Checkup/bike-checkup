const bikeRepository = require('../repositories/bikeRepository');

class BikeService{

	constructor(bikeRepository){
		this.bikeRepository = bikeRepository;
	}

	getBikesByUserId(userId){
        let query = {_id: userId};
        let res = bikeRepository.GetById(query).select('bikes')
        console.log("\n\n getBikesByUserId \n\n")
        console.log(res)
        return res
	}
}

const bikeService = new BikeService(bikeRepository);
module.exports = bikeService;