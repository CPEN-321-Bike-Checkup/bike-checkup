const axios = require('axios');
const activityRepository = require('../repositories/ActivityRepository');
const bikeRepository = require('../repositories/BikeRepository');
const componentRepository = require('../repositories/ComponentRepository');
const userRepository = require('../repositories/UserRepository');
const componentActivityRepostiory = require('../repositories/ComponentActivityRepository');
const Keys = require('../../client/keys.json');
const {ComponentSchema} = require('../schemas/Component');
const {random} = require('lodash');

class StravaService {
  constructor(
    activityRepository,
    bikeRepository,
    componentRepository,
    userRepository,
    componentActivityRepostiory,
  ) {
    this.activityRepository = activityRepository;
    this.bikeRepository = bikeRepository;
    this.componentRepository = componentRepository;
    this.userRepository = userRepository;
    this.componentActivityRepostiory = componentActivityRepostiory;
  }

  Get4MonthsAgo() {
    var date = new Date();
    date.setDate(date.getDate() - 30 * 4);
    return date;
  }

  async UpdateBikesForUser(userId) {
    var athlete = await this.GetAthlete(userId);
    var user = await this.userRepository.GetById(userId);

    console.log('BIKES ARE HERERERERERERERERR: ', athlete);
    var bikes = athlete.bikes.map((bike) => {
      return {
        _id: bike.id,
        owner_id: userId,
        label: bike.name,
        distance: bike.distance,
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

  //syncs updates to existing and creation of new activities over the last 4 months
  async UpdateActivitiesForUser(userId) {
    var activities = [];
    var token = await this.GetTokenForUser(userId);
    var user = await this.userRepository.GetById(userId);

    //update last 4 months of activities
    var dateString = this.Get4MonthsAgo().toString();
    var activitiesUrl = 'https://www.strava.com/api/v3/athlete/activities';
    activitiesUrl.concat('?after=').concat(dateString);

    var activitiesResp = await axios.get(activitiesUrl, {
      headers: {Authorization: 'Bearer '.concat(token)},
    });

    for (var i = 0; i < activitiesResp.data.length; i++) {
      var a = activitiesResp.data[i];
      var activity = {
        _id: a.id,
        athlete_id: a.athlete.id,
        description: a.name,
        distance: a.distance,
        time_s: a.elapsed_time,
        date: a.start_date,
      };
      var newActivity = this.activityRepository.CreateOrUpdate(activity);

      activities.push(newActivity);
    }
    return Promise.all(activities);
  }

  async UpdateComponentActivitiesForUser(userId) {
    //get all components for user that are not removed
    var compsPromise = this.componentRepository.GetComponentsForUser(userId);
    var activitiesPromise = this.activityRepository.GetByQuery({
      date: {$gte: this.Get4MonthsAgo()},
    });

    let [bikeComponents, activities] = await Promise.all([
      compsPromise,
      activitiesPromise,
    ]);
    var components = [].concat.apply([], bikeComponents);

    var componentActivities = [];
    components
      .filter((c) => c.removal_date === undefined)
      .forEach((comp) => {
        for (var i = 0; i < activities.length; i++) {
          var a = activities[i];
          if (a.date <= comp.attachment_date) {
            continue;
          }
          componentActivities.push({
            component_id: comp._id,
            activity_id: a._id,
          });
        }
      });
    return this.componentActivityRepostiory.CreateIfDoesntExist(
      componentActivities,
    );
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
  componentActivityRepostiory,
);
module.exports = stravaService;
