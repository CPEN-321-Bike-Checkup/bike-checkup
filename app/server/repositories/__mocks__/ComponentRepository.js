const {Mongoose} = require('mongoose');
const Repository = require('./Repository');

class ComponentRepository extends Repository {
  constructor(data) {
    super(data);
    this.count['componentsForUser'] = 0;
  }

  GetComponentsForUser(userId) {
    this.count['componentsForUser']++;
    return new Promise((resolve, reject) => {
      if (userId <= 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['componentsForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        if (userId === 1) {
          resolve(data);
        } else {
          resolve([]);
        }
      }
    });
  }

  GetById(componentId) {
    this.count['componentsForUser']++;
    return new Promise((resolve, reject) => {
      if (componentId <= 0) {
        throw new Mongoose.Error.ValidationError('Validation error');
      } else if (this.count['componentsForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (componentId) {
          case 1:
            resolve(component1);
            break;
          case 3:
            resolve(component2);
            break;
          case 4:
            resolve(component3);
            break;
          default:
            resolve([]);
        }
      }
    });
  }
}

const component1 = {
  _id: 1,
  bike_id: 1, //reference to Bike
  label: 'brakes',
  attachment_date: new Date('10/01/2020'),
  removal_date: new Date(),
};

const component2 = {
  _id: 3,
  bike_id: 2, //reference to Bike
  label: 'chains',
  attachment_date: new Date('08/15/2020'),
  removal_date: new Date(),
};

const component3 = {
  _id: 4,
  bike_id: 3,
  label: 'brakes',
  attachment_date: new Date('09/04/2020'),
  removal_date: new Date(),
};

var data = [component1, component2, component3];

var componentRepo = new ComponentRepository(data);

module.exports = componentRepo;
