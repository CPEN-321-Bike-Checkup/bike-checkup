const Repository = require('./Repository');
const ComponentActivityModel = require('../schemas/ComponentActivity')
  .ComponentActivityModel;

class ComponentActivityRepository extends Repository {
  constructor(componentActivityModel) {
    super(componentActivityModel);
  }

  GetDocumentKey(document) {
    return {
      component_id: document.component_id,
      activity_id: document.activity_id,
    };
  }
}
const componentActivityRepository = new ComponentActivityRepository(
  ComponentActivityModel,
);
module.exports = componentActivityRepository;
