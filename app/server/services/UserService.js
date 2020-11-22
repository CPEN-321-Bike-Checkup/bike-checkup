const userRepository = require('../repositories/UserRepository');
const deviceTokenRepository = require('../repositories/DeviceTokenRepository');

class UserService {
  constructor(userRepository, deviceTokenRepository) {
    this.userRepository = userRepository;
    this.deviceTokenRepository = deviceTokenRepository;
  }

  UserExists(userId) {
    return this.userRepository.Exists({_id: userId});
  }

  async RegisterNewDevice(userId, deviceToken) {
    await this.deviceTokenRepository
      .Delete({token: deviceToken, owner: userId})
      .catch((err) => {
        console.error(err);
      });
    await this.deviceTokenRepository
      .Create({token: deviceToken, owner: userId})
      .catch((err) => {
        console.error(err);
      });
  }

  DeleteDevice(userId, deviceToken) {
    return this.deviceTokenRepository.Delete({
      token: deviceToken,
      owner: userId,
    });
  }

  GetAllUsers() {
    return this.userRepository.GetAll();
  }

  GetUserById(id) {
    return userRepository.GetById(id);
  }

  GetUserByStravaToken(token) {
    return this.userRepository.GetUserByStravaToken(token);
  }

  CreateUser(user) {
    return this.userRepository.Create(users);
  }

  UpdateUser(user) {
    return this.userRepository.Update(user);
  }
}

const userService = new UserService(userRepository, deviceTokenRepository);
module.exports = userService;
