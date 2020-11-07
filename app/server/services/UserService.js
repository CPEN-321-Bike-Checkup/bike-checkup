const UserRepository = require('../repositories/UserRepository');
const DeviceTokenRepository = require('../repositories/DeviceTokenRepository');

class UserService {
	constructor(userRepository, deviceTokenRepository) {
		this.userRepository = userRepository;
		this.deviceTokenRepository = deviceTokenRepository;
	}

	async RegisterNewDevice(userId, deviceToken) {
		await this.deviceTokenRepository.Delete({ '_id': deviceToken, owner: userId }).catch(err => {
			return err;
		});
		await this.deviceTokenRepository.Create({ '_id': deviceToken, owner: userId }).catch(err => {
			return err;
		});
	}
}

const userService = new UserService(UserRepository, DeviceTokenRepository);
module.exports = userService;
var exports = module.exports;