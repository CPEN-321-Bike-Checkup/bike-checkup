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
    var user = await this.userModel.find({_id: userId}).exec();
    var records = [];
    user.bikes.forEach((bike) => {
      bike.components.forEach((component) => {
        records.concat(component.maintenance_records);
      });
    });
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
    var allRecords = this.GetMaintenanceRecordsForUser(userId);
    var historyRecords = [];
    allRecords.foreach(function (record) {
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
);
module.exports = maintenanceRecordRepository;
