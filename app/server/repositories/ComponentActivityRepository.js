const Repository = require('./Repository');
const ComponentActivityModel = require('../schemas/ComponentActivity')
  .ComponentActivityModel;

class ComponentActivityRepository extends Repository {
  constructor(componentActivityModel) {
    super(componentActivityModel);
  }
}
const componentActivityRepository = new ComponentActivityRepository(
  ComponentActivityModel,
);
module.exports = componentActivityRepository;
