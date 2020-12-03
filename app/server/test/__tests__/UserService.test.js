jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/DeviceTokenRepository');

const express = require('express');
const userService = require('../../services/UserService');
const app = express();
app.use(express.json());

var user = {
  _id: 3,
  bikes: [],
  name: 'Tim Sampleton',
  deviceTokens: [],
  strava_token: 'asdfoiuasfnloa',
  expires_in: '4938570',
  refresh_token: 'fesojdkvhnfmcasod',
  activity_cache_date: new Date(),
};

var userUpdate = {
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
};

var device = {
  token: 'asonhcfoisjuheoqihbnfcxsaoid',
  ownerId: '3',
};

describe('GetUserDevices(userId) Test Cases', () => {
  test('1. Get devices with valid userId', async () => {
    expect.assertions(5);
    try {
      let response = await userService.GetUserDevices(1);
      expect(response.length).toBe(2);
      expect(response[0].ownerId).toBe('1');
      expect(response[0].token).toBe('sdhflguhiuerhnbgsdlfughnaiujhrnf');
      expect(response[1].ownerId).toBe('1');
      expect(response[1].token).toBe('dfljghdsfnalsiujdfhnsdufniasjdhfn');
    } catch (err) {
      console.log(err);
    }
  });
});

describe('UserExists(userId) Test Cases', () => {
  test('1. User exists with valid userId', async () => {
    expect.assertions(1);
    try {
      let response = await userService.UserExists(1);
      expect(response).toBe(true);
    } catch (err) {
      console.log(err);
    }
  });

  test('2. User exists with invalid userId', async () => {
    expect.assertions(1);
    try {
      let response = await userService.UserExists(5);
      expect(response).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });
});

describe('CreateOrUpdateUsers(users) Test Cases', () => {
  test('1. Create new user', async () => {
    expect.assertions(2);
    try {
      let response = await userService.CreateOrUpdateUsers(user);
      expect(response._id).toBe(3);
      expect(response.name).toBe('Tim Sampleton');
    } catch (err) {
      console.log(err);
    }
  });

  test('2. Update existing user', async () => {
    expect.assertions(2);
    try {
      let response = await userService.CreateOrUpdateUsers(userUpdate);
      expect(response.n).toBe(1);
      expect(response.nModified).toBe(1);
    } catch (err) {
      console.log(err);
    }
  });
});

describe('RegisterNewDevice(userId, deviceToken) Test Cases', () => {
  test('1. Register device for existing user', async () => {
    expect.assertions(2);
    try {
      let response = await userService.RegisterNewDevice('1', 'aaa');
      expect(response.n).toBe(1);
      expect(response.nModified).toBe(1);
    } catch (err) {
      console.log(err);
    }
  });

  test('2. Register device for non-existing user', async () => {
    expect.assertions(2);
    try {
      let response = await userService.RegisterNewDevice('5', 'aaa');
      expect(response.owner).toBe('5');
      expect(response.token).toBe('aaa');
    } catch (err) {
      console.log(err);
    }
  });
});

describe('DeleteDevice(userId, deviceToken) Test Cases', () => {
  test('1. Delete existing data', async () => {
    expect.assertions(1);
    try {
      let response = await userService.DeleteDevice(
        1,
        'sdhflguhiuerhnbgsdlfughnaiujhrnf',
      );
      expect(response).toBe(true);
    } catch (err) {
      console.log(err);
    }
  });

  test('2. Delete non-existing data', async () => {
    expect.assertions(1);
    try {
      let response = await userService.DeleteDevice('5', 'bbb');
      expect(response).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });
});

describe('GetAllUsers() Test Cases', () => {
  test('1. Get all users', async () => {
    expect.assertions(5);
    try {
      let response = await userService.GetAllUsers();
      expect(response.length).toBe(2);
      expect(response[0]._id).toBe(1);
      expect(response[0].name).toBe('Bob Bobberson');
      expect(response[1]._id).toBe(2);
      expect(response[1].name).toBe('Jane Janenson');
    } catch (err) {
      console.log(err);
    }
  });
});

describe('GetUserById(id) Test Cases', () => {
  test('1. Get user with valid userId', async () => {
    expect.assertions(2);
    try {
      let response = await userService.GetUserById(1);
      expect(response._id).toBe(1);
      expect(response.name).toBe('Bob Bobberson');
    } catch (err) {
      console.log(err);
    }
  });

  test('2. Get user with invalid userId', async () => {
    expect.assertions(1);
    try {
      let response = await userService.GetUserById(5);
      expect(response).toBe(undefined);
    } catch (err) {
      console.log(err);
    }
  });
});

describe('GetUserByStravaToken(token) Test Cases', () => {
  test('1. Get user with valid token', async () => {
    expect.assertions(2);
    try {
      let response = await userService.GetUserByStravaToken(
        'asldofujihoinuashdfb',
      );
      expect(response._id).toBe(1);
      expect(response.name).toBe('Bob Bobberson');
    } catch (err) {
      console.log(err);
    }
  });

  test('2. Get user with invalid token', async () => {
    expect.assertions(1);
    try {
      let response = await userService.GetUserByStravaToken('aaa');
      expect(response).toBe(undefined);
    } catch (err) {
      console.log(err);
    }
  });
});

describe('CreateUsers(users) Test Cases', () => {
  test('1. Create new user', async () => {
    expect.assertions(2);
    try {
      let response = await userService.CreateUsers(user);
      expect(response._id).toBe(3);
      expect(response.name).toBe('Tim Sampleton');
    } catch (err) {
      console.log(err);
    }
  });
});

describe('DeleteUser(user) Test Cases', () => {
  test('1. Delete existing user', async () => {
    expect.assertions(1);
    try {
      let response = await userService.DeleteUser(user);
      expect(response).toBe(false);
    } catch (err) {
      console.log(err);
    }
  });
});
