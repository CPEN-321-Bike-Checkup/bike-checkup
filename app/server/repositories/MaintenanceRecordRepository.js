const {add} = require('lodash');
const {BikeModel} = require('../schemas/Bike');
const {ComponentModel} = require('../schemas/Component');
const Repository = require('./Repository');
const MaintenanceRecordModel = require('../schemas/MaintenanceRecord')
  .MaintenanceRecordModel;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

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
    var historyRecords = [];
    allRecords.forEach(function (record) {
      if (
        record.maintenance_date <= startDate &&
        record.maintenance_date >= endDate
      ) {
        historyRecords.push(record);
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
