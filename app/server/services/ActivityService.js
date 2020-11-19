const activityRepository = require('../repositories/ActivityRepository');

class ActivityService {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  //update to only get activities in date range
  GetActivitiesForUserInRange(userId, date, numDays) {
    return this.activityRepository.GetActivitiesForUserInRange(
      userId,
      date,
      numDays,
    );
  }
}

const activityService = new ActivityService(activityRepository);
module.exports = activityService;
