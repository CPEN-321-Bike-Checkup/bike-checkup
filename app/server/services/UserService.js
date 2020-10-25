const userRepository = require('../repositories/UserRepository');
const deviceTokenRepository = require('../repositories/DeviceTokenRepository');

class UserService{

	constructor(userRepository, deviceTokenRepository){
		this.userRepository = userRepository;
		this. deviceTokenRepository = deviceTokenRepository;	
	}

	RegisterNewDevice(userId, deviceToken){
		this.deviceTokenRepository.Delete({"_id": deviceToken, owner: userId}).exec()
		.then(this.deviceTokenRepository.Create({"_id": deviceToken, owner: userId}));	
	}
}

const userService = new UserService(userRepository, deviceTokenRepository);
module.exports = userService;