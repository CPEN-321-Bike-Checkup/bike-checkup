const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;
const BikeModel = require('../schemas/Bike').BikeModel;

class ComponentRepository extends Repository {
  constructor(componentModel, bikeModel) {
    super(componentModel);
    this.bikeModel = bikeModel;
  }

  async GetComponentsForUser(userId) {
    var bikes = await this.bikeModel.find({owner_id: userId}).exec();
    var components = this.documentModel
      .find({bike_id: {$in: bikes.map((b) => b._id)}})
      .exec();
    return components;
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
}

const componentRepository = new ComponentRepository(ComponentModel, BikeModel);
module.exports = componentRepository;
