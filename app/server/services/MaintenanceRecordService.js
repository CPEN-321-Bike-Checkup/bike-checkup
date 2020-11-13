const maintenanceRecordRepository = require('../repositories/MaintenanceRecordRepository');

class MaintenanceRecordService {
  constructor(maintenanceRecordRepository) {
    this.maintenanceRecordRepository = maintenanceRecordRepository;
  }

  // TODO: remove this - records will be created by TaskService when a task is completed
  async createRecord(document) {
    this.maintenanceRecordRepository.Create(document);
  }

  async getMaintenanceRecords(userId, daysOfHistory) {
    return maintenanceRecordRepository.GetMaintenanceRecordsHistory(
      userId,
      daysOfHistory,
    );
  }
}

const maintenanceRecordService = new MaintenanceRecordService(
  maintenanceRecordRepository,
);
module.exports = maintenanceRecordService;
