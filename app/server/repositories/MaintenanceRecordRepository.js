const {add} = require('lodash');
const {BikeModel} = require('../schemas/Bike');
const {ComponentModel} = require('../schemas/Component');
const Repository = require('./Repository');
const MaintenanceRecordModel = require('../schemas/MaintenanceRecord')
  .MaintenanceRecordModel;

class MaintenanceRecordRepository extends Repository {
  constructor(maintenanceRecordModel, bikeModel, componentModel) {
    super(maintenanceRecordModel);
    this.bikeModel = bikeModel;
    this.componentModel = componentModel;
  }

  addDays(currentDate, daysToAdd) {
    var final_date = new Date(currentDate);
    final_date.setDate(final_date.getDate() + daysToAdd);
    return final_date;
  }

  async GetMaintenanceRecordsForUser(userId) {
    var bikes = await this.bikeModel.find({owner_id: userId}).exec();
    var components = await this.componentModel
      .find({bike_id: {$in: bikes.map((b) => b._id)}})
      .exec();
    return this.documentModel
      .find({component_id: {$in: components.map((c) => c._id)}})
      .exec();
  }

  //Supporting function for front end
  async GetMaintenanceRecordsHistory(userId, startDate, daysOfHistory) {
    var endDate = this.addDays(startDate, -daysOfHistory);
    //get all records within history
    var allRecords = await this.GetMaintenanceRecordsForUser(userId);
    var components = await this.componentModel
      .find({_id: {$in: allRecords.map((r) => r.component_id)}})
      .exec();
    var bikes = await this.bikeModel
      .find({_id: components.map((c) => c.bike_id)})
      .exec();

    var historyRecords = [];
    allRecords.forEach(function (record) {
      if (
        record.maintenance_date <= startDate &&
        record.maintenance_date >= endDate
      ) {
        var component = components.find((c) =>
          c._id.equals(record.component_id),
        );
        var bike = bikes.find((b) => b._id === component.bike_id);

        var recordView = {
          _id: record._id,
          component: component.label,
          bike: bike.label,
          description: record.description,
          maintenance_date: record.maintenance_date,
        };
        historyRecords.push(recordView);
      }
    });

    //sort descending
    historyRecords.sort(function (x, y) {
      return y.maintenance_date - x.maintenance_date;
    });

    return historyRecords;
  }
}
const maintenanceRecordRepository = new MaintenanceRecordRepository(
  MaintenanceRecordModel,
  BikeModel,
  ComponentModel,
);
module.exports = maintenanceRecordRepository;
