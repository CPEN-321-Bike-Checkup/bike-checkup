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

	GetAllUsers() {
		return userRepository.GetAll();
	}

	GetUserById(id) {
		return userRepository.GetById(id);
	}

	CreateUsers(users) {
		return userRepository.Create(users);
	}

	UpdateUsers(UserIds, newUserVals) {
		return userRepository.Update(userId, newUserVals);
	}
}

const userService = new UserService(UserRepository, DeviceTokenRepository);
module.exports = userService;

var exports = module.exports;