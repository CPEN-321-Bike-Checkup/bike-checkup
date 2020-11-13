const Repository = require('./Repository');
const MaintenanceRecordModel = require('../schemas/MaintenanceRecord')
  .MaintenanceRecordModel;
const UserModel = require('../schemas/User').UserModel;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_DAY = 86400;

class MaintenanceRecordRepository extends Repository {
  constructor(maintenanceRecordModel, userModel) {
    super(maintenanceRecordModel);
    this.userModel = userModel;
  }

  async GetMaintenanceRecordsForUser(userId) {
    var users = await this.userModel.find({_id: userId}).lean().exec();
    if (users.length == 0) return null;

    var records = [];
    users[0].bikes.forEach((bike) => {
      bike.components.forEach((component) => {
        // Add bike and component fields
        component.maintenance_records.forEach((record) => {
          record.bike = bike.label;
          record.component = component.label;
        });

        records = records.concat(component.maintenance_records);
      });
    });

    console.log(records);
    return records;
  }

  //Supporting function for front end
  async GetMaintenanceRecordsHistory(userId, daysOfHistory) {
    var today = new Date();
    var historyDate = new Date(
      today.getTime() -
        daysOfHistory * SECONDS_PER_DAY * MILLISECONDS_PER_SECOND,
    );

    //get all records within history
    var allRecords = await this.GetMaintenanceRecordsForUser(userId);
    var historyRecords = [];
    allRecords.forEach(function (record) {
      if (record.maintenance_date >= historyDate) {
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
  UserModel,
);
module.exports = maintenanceRecordRepository;
