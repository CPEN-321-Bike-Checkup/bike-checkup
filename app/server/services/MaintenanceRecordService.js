const maintenanceRecordRepository = require('../repositories/MaintenanceRecordRepository');

class MaintenanceRecordService {
  constructor(maintenanceRecordRepository) {
    this.maintenanceRecordRepository = maintenanceRecordRepository;
  }

  // TODO: remove this - records will be created by TaskService when a task is completed
  CreateRecord(document) {
    return this.maintenanceRecordRepository.Create(document);
  }

  GetMaintenanceRecordsForUserInRange(userId, startDate, numberOfDays) {
    //update repo function to give days of history starting at date
    return this.maintenanceRecordRepository.GetMaintenanceRecordsHistory(
      userId,
      startDate,
      numberOfDays,
    );
  }

  GetMaintenanceRecords(userId, daysOfHistory) {
    return this.maintenanceRecordRepository.GetMaintenanceRecordsHistory(
      userId,
      daysOfHistory,
    );
  }
}

const maintenanceRecordService = new MaintenanceRecordService(
  maintenanceRecordRepository,
);
module.exports = maintenanceRecordService;
