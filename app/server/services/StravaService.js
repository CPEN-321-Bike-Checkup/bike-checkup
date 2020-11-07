const axios = require('axios');
const activityRepository = require('../repositories/ActivityRepository');
const bikeRepository = require('../repositories/BikeRepository');
const componentRepository = require('../repositories/ComponentRepository');
const userRepository = require('../repositories/UserRepository');



class StravaService{

	constructor(activityRepository, bikeRepository, componentRepository, userRepository){
		this.activityRepository = activityRepository;
		this.bikeRepository = bikeRepository;
		this.componentRepository= componentRepository;
		this.userRepository = userRepository;
	}

	async GetNewActivitiesForUser(userId){
		var activities = [];
		var token = this.GetTokenForUser(userId);
		var user = userRepository.GetById(userId);

		axios.setToken(token, 'Bearer');
		var activitiesResp = await axios.get('https://www.strava.com/api/v3/athlete/activities?after=' + user.activity_cache_date);

		activitiesResp.data.forEach(a => {
			var components = this.componentRepository.GetByBikeId(a.gear_id);
			var activity = {
				description: a.name,
				distance: a.distance,
				time_s: a.elapsed_time,
				date: a.start_date,
				components: components
			}
			this.activityRepository.Create(activity);				
			activities.push(activity);
		});
		return activities;
	}









	async GetTokenForUser(userId){
		var user = this.userRepository.GetById(userId);	
		if (user.expires_in < 120){
			var res = await axios.post('https://www.strava.com/api/v3/oauth/token', {client_id: 55294, client_secret: "d4199150472e3cd7520e12e203c69dd345b4da0a", grant_type: "refresh_token", refresh_token: user.refresh_token})
			user.strava_token = res.access_token;
			user.refresh_token = res.refresh_token;
			user.expires_in = res.expires_in;
			userRepository.Update(user._id, user);	
		}
		return strava_token;
	}	
}
const stravaService = new StravaService(activityRepository, bikeRepository, componentRepository, userRepository);
module.exports = stravaService;