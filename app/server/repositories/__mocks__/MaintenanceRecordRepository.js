const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class MaintenanceRecordRepository extends Repository {
  constructor(data) {
    super(data);
  }
}

var data = [];

var maintRecordRepo = MaintenanceRecordRepository(data);

module.exports = maintRecordRepo;
