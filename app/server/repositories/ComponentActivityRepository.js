const Repository = require('./Repository');
const ComponentActivityModel = require('../schemas/ComponentActivity')
  .ComponentActivityModel;

class ComponentActivityRepository extends Repository {
  constructor(componentActivityModel) {
    super(componentActivityModel);
  }

  GetDocumentKey(document) {
    var documentKey = {
      component_id: document.component_id,
      activity_id: document.activity_id,
    };
    return documentKey;
  }

  GetActivityIdsForComponent(componentId) {
    return this.documentModel
      .find({
        component_id: componentId,
      })
      .select('activity_id')
      .exec();
  }
}
const componentActivityRepository = new ComponentActivityRepository(
  ComponentActivityModel,
);
module.exports = componentActivityRepository;
