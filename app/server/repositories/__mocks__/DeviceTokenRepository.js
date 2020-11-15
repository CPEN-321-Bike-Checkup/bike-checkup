const Repository = require('./Repository');

class DeviceTokenRepository extends Repository {
  constructor(data) {
    super(data);
  }
}
var data = [
  {
    token: 'sdhflguhiuerhnbgsdlfughnaiujhrnf',
    ownerId: '1',
  },
  {
    token: 'dfljghdsfnalsiujdfhnsdufniasjdhfn',
    ownerId: '1',
  },
  {
    token: 'sdfjhspdofigfhnufhvnsdoufoipdsufv',
    ownerId: '2',
  },
];
var deviceTokenRepo = new DeviceTokenRepository(data);

module.exports = deviceTokenRepo;
