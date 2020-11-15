const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;
const UserModel = require('../schemas/User').UserModel;

class ComponentRepository extends Repository {
  constructor(componentModel, userModel) {
    super(componentModel);
    this.userModel = userModel;
  }

  async GetComponents(bikeId) {
    var bike = this.documentModel.find({bike: bikeId}).exec();
    if (bike == null) return null;

    var components = [];
    bike.components.forEach((component) => {
      components.push(component);
    })

    return components;
  }

  async GetBike(componentId) {
    var component = this.documentModel.find({_id: componentId}).exec();
    return component.bike;
  }

  async GetTasks(componentId) {
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
