const Repository = require('./Repository');

class UserRepository extends Repository {
  constructor(data) {
    super(data);
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
