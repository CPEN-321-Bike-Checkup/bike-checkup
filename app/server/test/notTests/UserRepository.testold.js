//const userRepo = require('../../repositories/UserRepository');
const userService = require('../../services/UserService');

jest.mock('../../repositories/UserRepository');
//var mockUserData = [
//	{_id: 1, bikes: [], strava_token: 'asdflkhgbusidhga', name: 'John Doe', deviceTokens: []},
//	{_id: 2, bikes: [], strava_token: 'bnghnupolujshdfgd', name: 'Jane Doe', deviceTokens: []},
//	{_id: 3, bikes: [], strava_token: 'aduohjigndfujhn', name: 'Bob Bobingson', deviceTokens: []},
//	{_id: 4, bikes: [], strava_token: 'hpgaeoruhing9jusdf', name: 'Jen Jeningson', deviceTokens: []},
//	{_id: 5, bikes: [], strava_token: 'gedohujnsdfgjiuhnsdf', name: 'Bike God', deviceTokens: []},
//];

//test('Test get new user', () => {
//  expect.assertions(2);
//  var newU = {
//    _id: 6,
//    bikes: [],
//    strava_token: 'hgsoludifhjasdf',
//    name: 'Very Good Test Name',
//    deviceTokens: [],
//  };
//  userService.CreateUsers(newU).then(async (newUser) => {
//    var users = await userService.GetAllUsers();
//    expect(users.length).toBe(6);
//    expect(users.find((user) => user._id === 6).name).toBe(
//      'Very Good Test Name',
//    );
//  });
//});
//
