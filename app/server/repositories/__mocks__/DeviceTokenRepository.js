const Repository = require('./Repository');

class DeviceTokenRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['tokensForUser'] = 0;
  }

  GetByQuery(userObj) {
    this.count['tokensForUser']++;
    return new Promise((resolve, reject) => {
      if (userObj.owner === 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['tokensForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (userObj.owner) {
          case 1:
            resolve([this.data[0], this.data[1]]);
            break;
          case 2:
            resolve([this.data[2]]);
            break;
          default:
            resolve([]);
            break;
        }
        //resolve(this.data);
      }
    });
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
