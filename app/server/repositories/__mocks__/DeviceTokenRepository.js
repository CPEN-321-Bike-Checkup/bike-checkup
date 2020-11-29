const Repository = require('./Repository');
const _ = require('lodash');

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
      }
    });
  }

  Update(doc) {
    this.count['tokensForUser']++;
    return new Promise((resolve, reject) => {
      if (doc.owner === undefined) {
        throw new Error('ValidationError');
      } else if (doc.owner === '0') {
        resolve({n: 0, nModified: 0});
      } else if (this.count['tokensForUser'] === 0) {
        throw new Error('InternalError');
      } else {
        let existingDoc = this.data.find(
          (datadoc) => datadoc.ownerId === doc.owner,
        );
        if (existingDoc == null) {
          resolve({n: 0, nModified: 0});
        }
        if (_.isEqual(existingDoc, doc)) {
          resolve({n: 1, nModified: 0});
        } else {
          resolve({n: 1, nModified: 1});
        }
      }
    });
  }

  Delete(doc) {
    this.count['tokensForUser']++;
    return new Promise((resolve, reject) => {
      if (doc.owner === undefined) {
        throw new Error('ValidationError');
      } else if (doc.owner === '0') {
        resolve({n: 0, nModified: 0});
      } else if (this.count['tokensForUser'] === 0) {
        throw new Error('InternalError');
      } else {
        if (doc.owner == 1 || doc.owner == 2) {
          resolve(true);
        } else {
          resolve(false);
        }
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
