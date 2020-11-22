const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;
const BikeModel = require('../schemas/Bike').BikeModel;

class ComponentRepository extends Repository {
  constructor(componentModel, bikeModel) {
    super(componentModel);
    this.bikeModel = bikeModel;
  }

  async GetComponentsForUser(userId, query) {
    let fullQuery;
    if (query !== undefined) {
      fullQuery = {...query, owner_id: userId};
    } else {
      fullQuery = {owner_id: userId};
    }
    var bikes = await this.bikeModel.find(fullQuery).exec();
    var compPromises = [];
    for (var i = 0; i < bikes.length; i++) {
      compPromises.push(this.GetComponentsForBike(bikes[i]._id));
    }
    return Promise.all(compPromises);
  }

  GetComponentsForBike(bikeId, query) {
    let fullQuery;
    if (query !== undefined) {
      fullQuery = {...query, bike_id: bikeId};
    } else {
      fullQuery = {bike_id: bikeId};
    }
    var promise = this.documentModel.find(fullQuery).exec();
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

const componentRepository = new ComponentRepository(ComponentModel, BikeModel);
module.exports = componentRepository;
