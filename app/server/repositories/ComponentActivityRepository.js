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

  /*GetActivityIdsForComponentInRange(componentId, date, numberOfDays) {
    var endDate = new Date();
    endDate.setDate(date.getDate() + numberOfDays);
    console.log(date);
    return this.documentModel
      .find({
        component_id: componentId,
        date: {$gte: date, $lte: endDate},
      })
      .select('activity_id')
      .exec();
  }*/

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
