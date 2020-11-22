const activityRepository = require('../repositories/ActivityRepository');
const componentActivityRepository = require('../repositories/ComponentActivityRepository');

class ActivityService {
  constructor(activityRepository, componentActivityRepository) {
    this.activityRepository = activityRepository;
    this.componentActivityRepository = componentActivityRepository;
  }

  //update to only get activities in date range
  GetActivitiesForUserInRange(userId, date, numDays) {
    return this.activityRepository.GetActivitiesForUserInRange(
      userId,
      date,
      numDays,
    );
  }

  GetActivitiesForComponentInRange(componentId, date, numDays) {
    return this.componentActivityRepository.GetActivitiesForComponentInRange(
      componentId,
      date,
      numDays,
    );
  }
}

const activityService = new ActivityService(activityRepository);
module.exports = activityService;
