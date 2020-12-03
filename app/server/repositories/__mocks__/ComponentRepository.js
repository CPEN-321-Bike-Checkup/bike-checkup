const mongoose = require('mongoose');
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
        throw new mongoose.Error.ValidationError('Validation error');
      } else if (this.count['componentsForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        switch (userId) {
          case 1:
            resolve(data);
            break;
          case 2:
            resolve([component4]);
            break;
          default:
            resolve([]);
            break;
        }
      }
    });
  }

  GetById(componentId) {
    this.count['componentsForUser']++;
    return new Promise((resolve, reject) => {
      if (componentId <= 0) {
        throw new mongoose.Error.ValidationError('Validation error');
      } else if (this.count['componentsForUser'] === 0) {
        throw new Error('internal server error');
      } else {
        if (
          new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca').equals(
            componentId,
          )
        ) {
          resolve(component1);
        } else if (
          new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb').equals(
            componentId,
          )
        ) {
          resolve(component2);
        } else if (
          new mongoose.Types.ObjectId('56cb91bdc3464f14678934cc').equals(
            componentId,
          )
        ) {
          resolve(component3);
        } else if (
          new mongoose.Types.ObjectId('56cb91bdc3464f14678934ce').equals(
            componentId,
          )
        ) {
          resolve(component5);
        }
      }
    });
  }
}

const component1 = {
  _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ca'),
  bike_id: 1, //reference to Bike
  label: 'brakes',
  attachment_date: new Date('10/01/2020'),
  removal_date: new Date(),
};

const component2 = {
  _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cb'),
  bike_id: 2, //reference to Bike
  label: 'chains',
  attachment_date: new Date('08/15/2020'),
  removal_date: new Date(),
};

const component3 = {
  _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cc'),
  bike_id: 4,
  label: 'brakes',
  attachment_date: new Date('09/04/2020'),
  removal_date: new Date(),
};

//component for undefined prediction date test
const component4 = {
  _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934cd'),
  bike_id: 5,
  label: 'tires',
  attachment_date: new Date('10/04/2020'),
  removal_date: new Date(),
};

//component to overshoot predictions
const component5 = {
  _id: new mongoose.Types.ObjectId('56cb91bdc3464f14678934ce'),
  bike_id: 6,
  label: 'chains',
  attachment_date: new Date('10/04/2020'),
  removal_date: new Date(),
};

var data = [component1, component2, component3];

var componentRepo = new ComponentRepository(data);

module.exports = componentRepo;
