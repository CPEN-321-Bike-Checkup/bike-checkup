class Repository{

	constructor(documentModel){
		this.documentModel = documentModel;
	}

	GetById(id){
		return this.documentModel.findById(id);
	}
	
	Create(documents){
		var promises = [];
		if (Array.isArray(documents)){
			documents.forEach(document => {
				promises.add(this.documentModel.create(document));	
			});
			return promises;
		} else {
			return this.documentModel.create(documents);	
		}
	}

	Update(documentKeys, newDocumentsVals){
		var promises = [];
		if (Array.isArray(documents)){
			documents.forEach(newDocumentVal, i => {
				promises.add(this.documentModel.findOneAndUpdate(documentKeys[i], newDocumentsVal));	
			});
			return promises;
		} else {
			return this.documentModel.findOneAndUpdate(documentKeys, newDocumentsVals);	
		}
	}
	
	Delete(documents){
		var promises = [];
		if (Array.isArray(documents)){
			documents.forEach(document => {
				promises.add(this.documentModel.deleteOne(document));
			});
			return promises;
		} else {
			return this.documentModel.deleteOne(documents);
		}
	}
}
module.exports = Repository;