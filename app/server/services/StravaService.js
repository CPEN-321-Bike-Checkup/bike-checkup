const axios = require('axios');
const activityRepository = require('../repositories/ActivityRepository');
const bikeRepository = require('../repositories/BikeRepository');
const componentRepository = require('../repositories/ComponentRepository');
const userRepository = require('../repositories/UserRepository');
const Keys = require('../../client/keys.json');

class StravaService {
  constructor(
    activityRepository,
    bikeRepository,
    componentRepository,
    userRepository,
  ) {
    this.activityRepository = activityRepository;
    this.bikeRepository = bikeRepository;
    this.componentRepository = componentRepository;
    this.userRepository = userRepository;
  }

  async UpdateBikesForUser(userId) {
    var athlete = await this.GetAthlete(userId);
    var user = await this.userRepository.GetById(userId);

    console.log('BIKES ARE HERERERERERERERERR: ', athlete);
    var bikes = athlete.bikes.map((bike) => {
      return {
        _id: bike.id,
        owner: userId,
        label: bike.name,
      };
    });
    user.bikes = bikes;
    this.bikeRepository.CreateOrUpdate(bikes);
    this.userRepository.Update(user);
  }

  async GetAthlete(userId) {
    var token = await this.GetTokenForUser(userId);
    var resp = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: {Authorization: 'Bearer '.concat(token)},
    });
    if (resp.status === 200) {
      return resp.data;
    } else {
      console.error('Failed to get strava athlete data: resp', resp);
    }
  }

  async SaveNewActivitiesForUser(userId) {
    var activities = [];
    var token = await this.GetTokenForUser(userId);
    var user = await this.userRepository.GetById(userId);

    var activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    if (user.activity_cache_date instanceof Date) {
      activitiesUrl.concat('?after=').concat(activity_cache_date);
    }

    var activitiesResp = await axios.get(activitiesUrl, {
      headers: {Authorization: 'Bearer '.concat(token)},
    });

    activitiesResp.data.forEach((a) => {
      var components = this.componentRepository.GetByBikeId(a.gear_id);
      var activity = {
        description: a.name,
        distance: a.distance,
        time_s: a.elapsed_time,
        date: a.start_date,
        components: components,
      };
      this.activityRepository.Create(activity);
      activities.push(activity);
    });
    return activities;
  }

  async GetTokenForUser(userId) {
    var user = await this.userRepository.GetById(userId);
    if (user.expires_in instanceof Number && user.expires_in < 120) {
      var res = await axios.post('https://www.strava.com/api/v3/oauth/token', {
        client_id: 55933,
        client_secret: Keys['strava-client-secret'],
        grant_type: 'refresh_token',
        refresh_token: user.refresh_token,
      });
      user.strava_token = res.access_token;
      user.refresh_token = res.refresh_token;
      user.expires_in = res.expires_in;
      userRepository.Update(user._id, user);
    }
    return user.strava_token;
  }
}
const stravaService = new StravaService(
  activityRepository,
  bikeRepository,
  componentRepository,
  userRepository,
);
module.exports = stravaService;
