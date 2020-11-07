const Repository = require('./Repository');
const UserModel = require('../schemas/User').UserModel;

class UserRepository extends Repository{

	constructor(userModel){
		super(userModel);
	}
	
	GetUserByStravaToken(token){
		return this.documentModel.find({strava_token: token}).exec();
	}
}
const userRepository = new UserRepository(UserModel);
module.exports = userRepository;