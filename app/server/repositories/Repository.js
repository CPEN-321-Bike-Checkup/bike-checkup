'use strict';
const _ = require('lodash');

class Repository {
  constructor(documentModel) {
    this.documentModel = documentModel;
  }

  GetDocumentKey(document) {
    return {_id: document._id};
  }

  GetByQuery(query) {
    return this.documentModel.find(query).exec();
  }

  GetAll() {
    return this.documentModel.find({}).exec();
  }

  async GetById(ids) {
    if (Array.isArray(ids)) {
      return this.documentModel.find({_id: {$in: ids}}).exec();
    } else {
      return this.documentModel.findById(ids).exec();
    }
  }

  Exists(documentProperties) {
    return this.documentModel.exists(documentProperties);
  }

  Create(documents) {
    if (Array.isArray(documents)) {
      return this.documentModel.insertMany(documents);
    } else {
      return this.documentModel.create(documents);
    }
  }

  Update(newDocumentsVals) {
    var promises = [];
    if (Array.isArray(newDocumentsVals)) {
      newDocumentsVals.forEach((newDocumentVal) => {
        promises.add(
          this.documentModel
            .updateOne(this.GetDocumentKey(newDocumentVal), newDocumentVal)
            .exec(),
        );
      });
      return Promise.all(promises);
    } else {
      return this.documentModel
        .updateOne(this.GetDocumentKey(newDocumentsVals), newDocumentsVals)
        .exec();
    }
  }

  async CreateIfDoesntExist(documents) {
    var promises = [];
    if (!Array.isArray(documents)) {
      documents = [documents];
    }

    for (var i = 0; i < document.length; i++) {
      doc = documents[i];
      var exists = await this.Exists(doc);
      if (!exists) {
        promises.push(this.Create(doc));
      }
    }
    return Promise.all(promises);
  }

  async CreateOrUpdate(documents) {
    var promises = [];
    if (!Array.isArray(documents)) {
      documents = [documents];
    }
    var existingKeys = await this.GetByQuery(
      documents.map((doc) => this.GetDocumentKey(doc)),
    );
    existingKeys = existingKeys.map((doc) => this.GetDocumentKey(doc));

    documents.forEach((document) => {
      var documentKey = this.GetDocumentKey(document);
      var exists = false;
      existingKeys.forEach((existingKey) => {
        if (_.isEqual(existingKey, documentKey)) {
          exists = true;
        }
      });
      if (exists) {
        promises.push(this.Update(document));
      } else {
        promises.push(this.Create(document));
      }
    });
    return Promise.all(promises);
  }

  Delete(documents) {
    var promises = [];
    if (Array.isArray(documents)) {
      documents.forEach((document) => {
        promises.add(this.documentModel.deleteOne(document).exec());
      });
      return Promise.all(promises);
    } else {
      return this.documentModel.deleteOne(documents).exec();
    }
  }
}
module.exports = Repository;
