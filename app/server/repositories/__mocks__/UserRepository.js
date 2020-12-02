const Repository = require('./Repository');

class UserRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['usersCount'] = 0;
  }

  Exists(userObj) {
    this.count['usersCount']++;
    return new Promise((resolve, reject) => {
      if (userObj._id === 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['usersCount'] === 0) {
        throw new Error('internal server error');
      } else {
        if (userObj._id === 1 || userObj._id === 2) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  }

  CreateOrUpdate(users) {
    this.count['usersCount']++;
    return new Promise((resolve, reject) => {
      if (this.count['usersCount'] === 0) {
        throw new Error('internal server error');
      } else {
        if (!Array.isArray(users)) {
          users = [users];
        }
        for (let index = 0; index < users.length; index++) {
          if (users[index]._id === 0) {
            throw new Mongoose.Error.ValidationError('Validation error');
          } else if (this.count['usersCount'] === 0) {
            throw new Error('internal server error');
          } else {
            if (users[index]._id === 1 || users[index]._id === 2) {
              resolve({n: 1, nModified: 1});
            } else {
              resolve(users[index]);
            }
          }
        }
      }
    });
  }

  GetAll() {
    this.count['usersCount']++;
    return new Promise((resolve, reject) => {
      if (this.count['usersCount'] === 0) {
        throw new Error('internal server error');
      } else {
        resolve(data);
      }
    });
  }

  GetUserByStravaToken(token) {
    this.count['usersCount']++;
    return new Promise((resolve, reject) => {
      if (this.count['usersCount'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (token) {
          case 'asldofujihoinuashdfb':
            resolve(data[0]);
            break;
          case 'jhvjsdksjdhblkdjfhs':
            resolve(data[1]);
            break;
          default:
            resolve();
            break;
        }
        resolve(data);
      }
    });
  }
}
var data = [
  {
    _id: 1,
    bikes: [],
    name: 'Bob Bobberson',
    deviceTokens: [
      {
        token: 'sdhflguhiuerhnbgsdlfughnaiujhrnf',
        ownerId: '1',
      },
      {
        token: 'dfljghdsfnalsiujdfhnsdufniasjdhfn',
        ownerId: '1',
      },
    ],
    strava_token: 'asldofujihoinuashdfb',
    expires_in: '239482',
    refresh_token: 'asdjfhodsifujhasfh',
    activity_cache_date: new Date(),
  },
  {
    _id: 2,
    bikes: [],
    name: 'Jane Janenson',
    deviceTokens: [
      {
        token: 'sdfjhspdofigfhnufhvnsdoufoipdsufv',
        ownerId: '2',
      },
    ],
    strava_token: 'jhvjsdksjdhblkdjfhs',
    expires_in: '23492378',
    refresh_token: 'lkgjdfshnmgoslijrhncaa',
    activity_cache_date: new Date(),
  },
];
var userRepo = new UserRepository(data);

module.exports = userRepo;
