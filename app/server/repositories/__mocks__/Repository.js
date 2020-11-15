const {Mongoose} = require('mongoose');

class Repository {
  constructor(data) {
    this.data = data;
    this.count = {create: 0, update: 0, delete: 0, getById: 0};
    console.warn('WARNING: USING MOCKED REPOSITORY BASE CLASS');
  }

  GetById(id) {
    this.count['getById']++;
    return new Promise((resolve, reject) => {
      if (doc._id === undefined) {
        throw new Error('ValidationError');
      } else if (doc._id === 0) {
        throw new Error('DocumentNotFoundError');
      } else if (this.count['getById'] === 0) {
        throw new Error('InternalError');
      } else {
        resolve(this.data.find((doc) => doc._id === id));
      }
    });
  }

  Create(doc) {
    this.count['create']++;
    return new Promise((resolve, reject) => {
      if (doc._id === undefined) {
        throw new Error('ValidationError');
      } else if (doc._id === 0) {
        throw new Error('DocumentNotFoundError');
      } else if (this.count['create'] === 0) {
        throw new Error('InternalError');
      } else {
        resolve(doc);
      }
    });
  }

  Update(doc) {
    this.count['update']++;
    return new Promise((resolve, reject) => {
      if (doc._id === undefined) {
        throw new Error('ValidationError');
      } else if (doc._id === 0) {
        throw new Error('DocumentNotFoundError');
      } else if (this.count['update'] === 0) {
        throw new Error('InternalError');
      } else {
        resolve(doc);
      }
    });
  }

  Delete(doc) {
    this.count['delete']++;
    return new Promise((resolve, reject) => {
      if (doc._id === undefined) {
        throw new Error('ValidationError');
      } else if (doc._id === 0) {
        throw new Error('DocumentNotFoundError');
      } else if (this.count['delete'] === 0) {
        throw new Error('InternalError');
      } else {
        resolve(true);
      }
    });
  }
}

module.exports = Repository;
