const Repository = require('./Repository');
const MaintenanceTaskModel = require('../schemas/MaintenanceTask')
  .MaintenanceTaskModel;
const UserModel = require('../schemas/User').UserModel;

class MaintenanceTaskRepository extends Repository {
  constructor(maintenanceTaskModel, userModel) {
    super(maintenanceTaskModel);
    this.userModel = userModel;
  }

  async GetMaintenanceTasksForUser(userId) {
    var user = await this.userModel.find({_id: userId}).exec();
    var tasks = [];
    user.bikes.forEach((bike) => {
      bike.components.forEach((component) => {
        tasks.concat(component.maintenance_tasks);
      });
    });
    return tasks;
  }
}
const maintenanceTaskRepository = new MaintenanceTaskRepository(
  MaintenanceTaskModel,
  UserModel,
);
module.exports = maintenanceTaskRepository;
