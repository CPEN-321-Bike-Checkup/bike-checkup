const userRepository = require('../repositories/UserRepository');
const deviceTokenRepository = require('../repositories/DeviceTokenRepository');

class UserService {
  constructor(userRepository, deviceTokenRepository) {
    this.userRepository = userRepository;
    this.deviceTokenRepository = deviceTokenRepository;
  }

  GetUserDevices(userId) {
    return this.deviceTokenRepository.GetByQuery({owner: userId});
  }

  UserExists(userId) {
    return this.userRepository.Exists({_id: userId});
  }

  CreateOrUpdateUsers(users) {
    return this.userRepository.CreateOrUpdate(users);
  }

  async RegisterNewDevice(userId, deviceToken) {
    var device = {token: deviceToken, owner: userId};
    var updateResp = await this.deviceTokenRepository.Update(device);
    if (updateResp.n === 0) {
      var resp = await this.deviceTokenRepository.Create(device);
      return resp;
    } else {
      return updateResp;
    }
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
    return this.userRepository.GetById(id);
  }

  GetUserByStravaToken(token) {
    return this.userRepository.GetUserByStravaToken(token);
  }

  CreateUsers(users) {
    return this.userRepository.Create(users);
  }

  DeleteUser(user) {
    return this.userRepository.Delete(user);
  }
}

const userService = new UserService(userRepository, deviceTokenRepository);
module.exports = userService;
