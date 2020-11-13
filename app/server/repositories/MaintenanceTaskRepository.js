const {ComponentModel} = require('../schemas/Component');
const Repository = require('./Repository');
const MaintenanceTaskModel = require('../schemas/MaintenanceTask')
  .MaintenanceTaskModel;
const UserModel = require('../schemas/User').UserModel;

class MaintenanceTaskRepository extends Repository {
  constructor(maintenanceTaskModel, userModel, componentModel) {
    super(maintenanceTaskModel);
    this.userModel = userModel;
    this.componentModel = componentModel;
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

  async GetMaintenanceTasksForComponent(componentId) {
    var component = await this.componentModel.findById(componentId).exec();
    return component.maintenance_tasks;
  }
}
const maintenanceTaskRepository = new MaintenanceTaskRepository(
  MaintenanceTaskModel,
  UserModel,
  ComponentModel,
);
module.exports = maintenanceTaskRepository;
