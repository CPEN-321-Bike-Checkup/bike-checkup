const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class ComponentActivityRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['activitiesForComponent'] = 0;
  }

  GetActivityIdsForComponent(componentId) {
    this.count['activitiesForComponent']++;
    return new Promise((resolve, reject) => {
      if (componentId === 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['activitiesForComponent'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (componentId) {
          case 1:
            resolve([
              componentActivity1,
              componentActivity2,
              componentActivity3,
            ]);
            break;
          case 3:
            resolve([componentActivity4, componentActivity5]);
            break;
          default:
            resolve([]);
        }
      }
    });
  }
}

const componentActivity1 = {
  component_id: 1,
  activity_id: 1,
};

const componentActivity2 = {
  component_id: 1,
  activity_id: 2,
};

const componentActivity3 = {
  component_id: 1,
  activity_id: 3,
};

const componentActivity4 = {
  component_id: 3,
  activity_id: 4,
};

const componentActivity5 = {
  component_id: 3,
  activity_id: 5,
};

var data = [
  componentActivity1,
  componentActivity2,
  componentActivity3,
  componentActivity4,
  componentActivity5,
];

var componentActivityRepo = new ComponentActivityRepository(data);

module.exports = componentActivityRepo;
