const {Mongoose} = require('mongoose');

class Repository {
  constructor(data) {
    this.data = data;
    this.count = {create: 0, update: 0, delete: 0};
  }

  Create(doc) {
    this.count['create']++;
    return new Promise((resolve, reject) => {
      if (doc._id === 0) {
        reject(new Mongoose.Error.ValidationError('Validation error'));
      } else if (this.count['create'] === 0) {
        reject(new Error('internal server error'));
      } else {
        resolve(doc);
      }
    });
  }

  Update(doc) {
    this.count['update']++;
    return new Promise((resolve, reject) => {
      if (doc._id === 0) {
        reject(new Mongoose.Error.ValidationError('Validation error'));
      } else if (this.count['update'] === 0) {
        reject(new Error('internal server error'));
      } else {
        resolve(doc);
      }
    });
  }

  Delete(doc) {
    this.count['delete']++;
    return new Promise((resolve, reject) => {
      if (doc._id === 0) {
        reject(Mongoose.Error.ValidationError);
      } else if (this.count['delete'] === 0) {
        reject(new Error('internal server error'));
      } else {
        resolve(true);
      }
    });
  }
}

module.exports = Repository;
