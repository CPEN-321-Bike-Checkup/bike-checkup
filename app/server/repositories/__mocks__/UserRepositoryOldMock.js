const UserModel = require('../../schemas/User').UserModel;

var mockUserData = [
  {
    _id: 1,
    bikes: [],
    strava_token: 'asdflkhgbusidhga',
    name: 'John Doe',
    deviceTokens: [],
  },
  {
    _id: 2,
    bikes: [],
    strava_token: 'bnghnupolujshdfgd',
    name: 'Jane Doe',
    deviceTokens: [],
  },
  {
    _id: 3,
    bikes: [],
    strava_token: 'aduohjigndfujhn',
    name: 'Bob Bobingson',
    deviceTokens: [],
  },
  {
    _id: 4,
    bikes: [],
    strava_token: 'hpgaeoruhing9jusdf',
    name: 'Jen Jeningson',
    deviceTokens: [],
  },
  {
    _id: 5,
    bikes: [],
    strava_token: 'gedohujnsdfgjiuhnsdf',
    name: 'Bike God',
    deviceTokens: [],
  },
];

class UserRepository {
  constructor(mockData) {
    this.data = mockData;
    console.warn('WARNING: USING MOCKED REPOSITORY');
  }

  GetAll() {
    return new Promise((resolve, reject) => {
      resolve(this.data);
    });
  }

  GetById(id) {
    return new Promise((resolve, reject) => {
      var user = this.data.find((cur) => cur._id === id);
      resolve(typeof user === 'undefined' ? null : user);
    });
  }

  Create(users) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(users)) {
        users = [users];
      }

      users.forEach((user) => {
        var valError = validateUser(user);
        if (typeof valError !== 'undefined') {
          reject(valError);
        }
      });
      this.data = this.data.concat(users);
      resolve(users);
    });
  }

  Update(userIds, newUserVals) {
    return new Promise((resolve, reject) => {
      var newDataList = this.data.filter((user) => !(user._id in userIds));
      var updatedUsers = [];
      newUserVals.forEach(newUserVal, (i) => {
        var user = this.GetById(userIds[i]);
        var updatedUser = {...user, ...newUserVal};
        var valError = validateUser(updatedUser);
        if (typeof valError !== 'undefined') {
          reject(valError);
        }
        newDataList.push(updatedUser);
        updatedUsers.push(updatedUser);
      });
      this.data = newDataList;
      resolve(updatedUsers);
    });
  }

  Delete(users) {
    return new Promise((resolve, reject) => {
      var userIds = users.map((user) => user._id);
      this.data = this.data.filter((user) => !(user._id in userIds));
      resolve(true);
    });
  }
}

function validateUser(user) {
  var valUser = new UserModel(user);
  return valUser.validateSync();
}

const mockRepository = new UserRepository(mockUserData);

module.exports = mockRepository;
