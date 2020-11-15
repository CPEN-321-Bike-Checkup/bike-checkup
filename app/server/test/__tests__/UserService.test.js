jest.mock('../../repositories/UserRepository');
jest.mock('../../repositories/DeviceTokenRepository');

const axios = require('axios');
const express = require('express');
const app = express();
app.use(express.json());
const initUserRoutes = require('../../routes/UserRoutes');
let server;

beforeAll(() => {
  server = app.listen(port, () => {
    initUserRoutes(app);
  });
});

afterAll(() => {
  server.close();
});

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

describe('Get User Tests', async () => {
  test('Get user by ID 500 Error', async () => {
    expect.assertions(1);
    var result = await axios.get(url + '/20');
    var code = result.status;
    expect(code).toBe(500);
    /*axios.get(url + '/20').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });*/
  });

  test('Get user by ID 200 Ok', () => {
    expect.assertions(1);
    axios.get(url + '/1').then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Get user by ID 404 Error', () => {
    expect.assertions(1);
    axios.get(url + '/0').catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });
});

describe('Create User Tests', () => {
  test('Create User 500 Error', () => {
    expect.assertions(1);
    axios.post(url, user).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Create user 200 Ok', () => {
    expect.assertions(1);
    axios.post(url).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('create user 400 Error', () => {
    expect.assertions(1);
    axios.post(url, userModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('Update User Tests', () => {
  test('Update user 500 Error', () => {
    expect.assertions(1);
    axios.put(url, user).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Update user 200 Ok', () => {
    expect.assertions(1);
    axios.put(url, user).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Update user 404 Error', () => {
    expect.assertions(1);
    axios.put(url, userModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Update user 400 Error', () => {
    expect.assertions(1);
    axios.put(url, userModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('Delete Device Tests', () => {
  test('Delete device 500 Error', () => {
    expect.assertions(1);
    axios.delete(url + 'registerDevice', device).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Delete device 200 Ok', () => {
    expect.assertions(1);
    axios.delete(url + 'registerDevice', device).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
    });
  });

  test('Delete device 404 Error', () => {
    expect.assertions(1);
    axios.delete(url + 'registerDevice', deviceModifiedId0).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(404);
    });
  });

  test('Delete device 400 Error', () => {
    expect.assertions(1);
    axios.delete(url + 'registerDevice', deviceModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});

describe('Create Device Tests', () => {
  test('Create device 500 Error', () => {
    expect.assertions(1);
    axios.post(url + 'registerDevice', device).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(500);
    });
  });

  test('Create device 200 Ok', () => {
    expect.assertions(1);
    axios.post(url + 'registerDevice', device).then((resp) => {
      var code = resp.status;
      expect(code).toBe(200);
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
    axios.post(url + 'registerDevice', deviceModifiedNoId).catch((error) => {
      var code = error.response.status;
      expect(code).toBe(400);
    });
  });
});
