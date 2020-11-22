const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;
const UserModel = require('../schemas/User').UserModel;

class ComponentRepository extends Repository {
  constructor(componentModel, userModel) {
    super(componentModel);
    this.userModel = UserModel;
  }

  GetComponentsForBike(bikeId) {
    var promise = this.documentModel.find({bike_id: bikeId}).exec();
    return promise;
  }

  GetBike(componentId) {
    var component = this.documentModel.find({_id: componentId}).exec();
    return component.bike;
  }

  GetTasks(componentId) {
    var component = this.documentModel.find({_id: componentId}).exec();
    return component.maintenance_tasks;
  }

  async AddComponent() {
    // TODO: Implement this
    // Return new componentId after MongoDB exchange
  }

  async RemoveComponent(componentId) {
    // TODO: Implement this
  }
}

const componentRepository = new ComponentRepository(ComponentModel, UserModel);
module.exports = componentRepository;
