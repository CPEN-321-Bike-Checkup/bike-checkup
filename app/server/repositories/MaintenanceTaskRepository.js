const Repository = require('./Repository');
const {MaintenanceTaskModel} = require('../schemas/MaintenanceTask');
const {ComponentModel} = require('../schemas/Component');
const {BikeModel} = require('../schemas/Bike');

class MaintenanceTaskRepository extends Repository {
  constructor(maintenanceTaskModel, bikeModel, componentModel) {
    super(maintenanceTaskModel);
    this.MaintenanceTaskModel = this.documentModel;
    this.bikeModel = bikeModel;
    this.componentModel = componentModel;
  }

  GetMaintenanceTasksForUser(userId) {
    return new Promise((resolve, reject) => {
      this.bikeModel
        .find({owner_id: userId})
        .exec()
        .then((bikes) => {
          this.componentModel
            .find({bike_id: {$in: bikes.map((b) => b._id)}})
            .exec()
            .then((components) => {
              resolve(
                this.GetMaintenanceTasksForComponents(
                  components.map((comp) => comp._id),
                ),
              );
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  GetMaintenanceTasksForComponents(componentIds) {
    return new Promise((resolve, reject) => {
      this.documentModel
        .find({component_id: {$in: componentIds}})
        .exec()
        .then((tasks) => {
          resolve(tasks);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
const maintenanceTaskRepository = new MaintenanceTaskRepository(
  MaintenanceTaskModel,
  BikeModel,
  ComponentModel,
);
module.exports = maintenanceTaskRepository;
