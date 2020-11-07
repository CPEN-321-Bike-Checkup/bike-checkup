const Repository = require('./Repository');
const ActivityModel = require('../schemas/Activity').ActivityModel;

class ActivityRepository extends Repository {
  constructor(activityModel) {
    super(activityModel);
  }
}
const activityRepository = new ActivityRepository(activityModel);
module.exports = activityRepository;
