const Repository = require('./Repository');
const UserModel = require('../schemas/User').UserModel;

class UserRepository extends Repository {

	constructor(userModel) {
		super(userModel);
	}
}
const userRepository = new UserRepository(UserModel);
module.exports = userRepository;
