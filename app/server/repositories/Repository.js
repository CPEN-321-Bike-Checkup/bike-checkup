class Repository {
	constructor(documentModel) {
		this.documentModel = documentModel;
	}

	GetAll() {
		return this.documentModel.find({}).exec();
	}

	GetById(id) {
		return this.documentModel.findById(id).exec();
	}

	Create(documents) {
		return this.documentModel.create(documents);
	}

	Update(documentKeys, newDocumentsVals) {
		var promises = [];
		if (Array.isArray(documents)) {
			documents.forEach(newDocumentVal, i => {
				promises.add(this.documentModel.findOneAndUpdate(documentKeys[i], newDocumentsVal).exec());
			});
			return promises;
		} else {
			return this.documentModel.findOneAndUpdate(documentKeys, newDocumentsVals).exec();
		}
	}

	Delete(documents) {
		var promises = [];
		if (Array.isArray(documents)) {
			documents.forEach(document => {
				promises.add(this.documentModel.deleteOne(document).exec());
			});
			return promises;
		} else {
			return this.documentModel.deleteOne(documents).exec();
		}
	}
}
module.exports = Repository;
