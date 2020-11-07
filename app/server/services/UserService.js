const userRepository = require('../repositories/UserRepository');
const deviceTokenRepository = require('../repositories/DeviceTokenRepository');

class UserService{

	constructor(userRepository, deviceTokenRepository){
		this.userRepository = userRepository;
		this. deviceTokenRepository = deviceTokenRepository;	
	}

	async RegisterNewDevice(userId, deviceToken){
		await this.deviceTokenRepository.Delete({token: deviceToken, owner: userId}).catch(err => {
			console.error(err);
		});
		await this.deviceTokenRepository.Create({token: deviceToken, owner: userId}).catch(err => {
			console.error(err);
		});
	}

	GetAllUsers(){
		return userRepository.GetAll();
	}

	GetUserByStravaToken(token){
		return userRepository.GetUserByStravaToken(token);
	}
	
	CreateUsers(users){
		return userRepository.Create(users);
	}
	
	UpdateUsers(UserIds, newUserVals){
		return userRepository.Update(userId, newUserVals);
	}
	
}

const userService = new UserService(userRepository, deviceTokenRepository);
module.exports = userService;

var exports = module.exports;