const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;

class ComponentRepository extends Repository {
  constructor(componentModel) {
    super(componentModel);
  }

  GetComponents(bikeId) {
    this.documentModel.find({bike: bikeId}).exec();
    // TODO: Return components corresponding to the bikeId bike
  }

  GetBike(componentId) {

  }

  GetComponentTasks(componentId) {
    var components = this.documentModel.find({_id: componentId}).exec();
    return components.maintenance_tasks;
  }

  AddComponent() {
    // TODO: Return new componentId after MongoDB exchange
  }

  RemoveComponent(componentId) {

  }
}
const componentRepository = new ComponentRepository(ComponentModel);
module.exports = componentRepository;
