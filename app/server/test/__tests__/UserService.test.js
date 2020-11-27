jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/DeviceTokenRepository');

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const initUserRoutes = require('../../routes/UserRoutes');
const userService = require('../../services/UserService');
let server;

beforeAll(() => {});

afterAll(() => {});

var url = 'http://' + ip + ':' + port + '/user';
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

//user without an id
var userModifiedNoId = JSON.parse(JSON.stringify(user));
delete userModifiedNoId._id;
//user id of 0
var userModifiedId0 = JSON.parse(JSON.stringify(user));
userModifiedId0._id = 0;

var device = {
  token: 'asonhcfoisjuheoqihbnfcxsaoid',
  ownerId: '3',
};
//device without an token
var deviceModifiedNoId = JSON.parse(JSON.stringify(device));
delete deviceModifiedNoId.token;
//token of 0
var deviceModifiedId0 = JSON.parse(JSON.stringify(device));
deviceModifiedId0.token = 0;
//owner of 0
var deviceModifiedOwnerId0 = JSON.parse(JSON.stringify(device));
deviceModifiedOwnerId0.ownerId = 0;

describe('GetUserDevices(userId) Test Cases', () => {
  test('1. Get devices with valid userId', async () => {
    expect.assertions(5);
    let response = await userService.GetUserDevices(1);
    expect(response.length).toBe(2);
    expect(response[0].ownerId).toBe('1');
    expect(response[0].token).toBe('sdhflguhiuerhnbgsdlfughnaiujhrnf');
    expect(response[1].ownerId).toBe('1');
    expect(response[1].token).toBe('dfljghdsfnalsiujdfhnsdufniasjdhfn');
  });
});

describe('UserExists(userId) Test Cases', () => {
  test('1. User exists with valid userId', async () => {
    expect.assertions(1);
    let response = await userService.UserExists(1);
    expect(response).toBe(true);
  });

  test('2. User exists with invalid userId', async () => {
    expect.assertions(1);
    let response = await userService.UserExists(5);
    expect(response).toBe(false);
  });
});

describe('CreateOrUpdateUsers(users) Test Cases', () => {
  test('1. Create new user', async () => {
    expect.assertions(2);
    let response = await userService.CreateOrUpdateUsers(user);
    expect(response._id).toBe(3);
    expect(response.name).toBe('Tim Sampleton');
  });

  test('2. Update existing user', async () => {
    expect.assertions(2);
    let response = await userService.CreateOrUpdateUsers(userUpdate);
    expect(response.n).toBe(1);
    expect(response.nModified).toBe(1);
  });
});

describe('RegisterNewDevice(userId, deviceToken) Test Cases', () => {
  test('1. Register device for existing user', async () => {
    expect.assertions(2);
    let response = await userService.RegisterNewDevice('1', 'aaa');
    expect(response.n).toBe(1);
    expect(response.nModified).toBe(1);
  });

  test('2. Register device for non-existing user', async () => {
    expect.assertions(2);
    let response = await userService.RegisterNewDevice('5', 'aaa');
    expect(response.owner).toBe('5');
    expect(response.token).toBe('aaa');
  });
});

describe('DeleteDevice(userId, deviceToken) Test Cases', () => {
  test('1. Delete existing data', async () => {
    expect.assertions(1);
    let response = await userService.DeleteDevice(
      '1',
      'sdhflguhiuerhnbgsdlfughnaiujhrnf',
    );
    expect(response).toBe(true);
  });

  test('2. Delete non-existing data', async () => {
    expect.assertions(1);
    let response = await userService.DeleteDevice('5', 'bbb');
    expect(response).toBe(false);
  });
});

describe('GetAllUsers() Test Cases', () => {
  test('1. Get all users', async () => {
    expect.assertions(5);
    let response = await userService.GetAllUsers();
    expect(response.length).toBe(2);
    expect(response[0]._id).toBe(1);
    expect(response[0].name).toBe('Bob Bobberson');
    expect(response[1]._id).toBe(2);
    expect(response[1].name).toBe('Jane Janenson');
  });
});

describe('GetUserById(id) Test Cases', () => {
  test('1. Get user with valid userId', async () => {
    expect.assertions(2);
    let response = await userService.GetUserById(1);
    expect(response._id).toBe(1);
    expect(response.name).toBe('Bob Bobberson');
  });

  test('2. Get user with invalid userId', async () => {
    expect.assertions(1);
    let response = await userService.GetUserById(5);
    expect(response).toBe(undefined);
  });
});

describe('GetUserByStravaToken(token) Test Cases', () => {
  test('1. Get user with valid token', async () => {
    expect.assertions(2);
    let response = await userService.GetUserByStravaToken(
      'asldofujihoinuashdfb',
    );
    expect(response._id).toBe(1);
    expect(response.name).toBe('Bob Bobberson');
  });

  test('2. Get user with invalid token', async () => {
    expect.assertions(1);
    let response = await userService.GetUserByStravaToken('aaa');
    expect(response).toBe(undefined);
  });
});

describe('CreateUsers(users) Test Cases', () => {
  test('1. Create new user', async () => {
    expect.assertions(2);
    let response = await userService.CreateUsers(user);
    expect(response._id).toBe(3);
    expect(response.name).toBe('Tim Sampleton');
  });
});

/*
describe('Get User Tests', async () => {
  test('Get user by ID 500 Error', () => {
    expect.assertions(1);
    return axios.get(url + '/20').then((resp) => {
      var code = resp.status;
      expect(code).toBe(500);
    });
  });

  test('Get user by ID 200 Ok', () => {
    expect.assertions(2);
    return axios.get(url + '/1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
      expect(resp.data._id).toBe(1);
    });
  });

  test('Get user by ID 404 Error', () => {
    expect.assertions(1);
    return axios.get(url + '/0').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });
});

describe('Create User Tests', () => {
  test('Create User 500 Error', () => {
    expect.assertions(1);
    return axios.post(url, user).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Create user 201 Ok', () => {
    expect.assertions(1);
    return axios.post(url).then((resp) => {
      var code = resp.status;
      expect(code).toBe(201);
    });
  });

  test('create user 400 Error', () => {
    expect.assertions(1);
    return axios.post(url, userModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('Update User Tests', () => {
  test('Update user 500 Error', () => {
    expect.assertions(1);
    return axios.put(url, user).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Update user 200 Ok', () => {
    expect.assertions(1);
    return axios.put(url, user).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Update user 404 Error', () => {
    expect.assertions(1);
    return axios.put(url, userModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Update user 400 Error', () => {
    expect.assertions(1);
    return axios.put(url, userModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('Delete Device Tests', () => {
  test('Delete device 500 Error', () => {
    expect.assertions(1);
    return axios.delete(url + 'registerDevice', device).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Delete device 200 Ok', () => {
    expect.assertions(1);
    return axios.delete(url + 'registerDevice', device).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Delete device 404 Error', () => {
    expect.assertions(1);
    return axios
      .delete(url + 'registerDevice', deviceModifiedId0)
      .catch((error) => {
        var code = error.response.status;
        expect(code).toBe(404);
      });
  });

  test('Delete device 400 Error', () => {
    expect.assertions(1);
    return axios
      .delete(url + 'registerDevice', deviceModifiedNoId)
      .catch((error) => {
        var code = error.response.status;
        expect(code).toBe(400);
      });
  });
});

describe('Create Device Tests', () => {
  test('Create device 500 Error', () => {
    expect.assertions(1);
    return axios.post(url + 'registerDevice', device).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Create device 201 Ok', () => {
    expect.assertions(1);
    return axios.post(url + 'registerDevice', device).then((resp) => {
      var code = resp.status;
      expect(code).toBe(201);
    });
  });

  test('Create device 404 Error', () => {
    expect.assertions(1);
    axios
      .post(url + 'registerDevice', deviceModifiedOwnerId0)
      .catch((error) => {
        var code = error.response.status;
        expect(code).toBe(404);
      });
  });

  test('Create device 400 Error', () => {
    expect.assertions(1);
    return axios
      .post(url + 'registerDevice', deviceModifiedNoId)
      .catch((error) => {
        var code = error.response.status;
        expect(code).toBe(400);
      });
  });
});
*/
