const Repository = require('./Repository');
const DeviceTokenModel = require('../schemas/DeviceToken').DeviceTokenModel;

class DeviceTokenRepository extends Repository {
  constructor(deviceTokenModel) {
    super(deviceTokenModel);
  }

  GetDocumentKey(document) {
    return {token: document.token};
  }
}
const deviceTokenRepository = new DeviceTokenRepository(DeviceTokenModel);
module.exports = deviceTokenRepository;
