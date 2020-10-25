class Repository{

	constructor(documentModel){
		this.documentModel = documentModel;
	}

	GetById(id){
		this.documentModel.findById(id);
	}
	
	Create(documents){
		if (Array.isArray(documents)){
			documents.forEach(document => {
				this.documentModel.create(document);	
			});
		} else {
			this.documentModel.create(documents);	
		}
	}

	Update(documentKeys, newDocumentsVals){

		if (Array.isArray(documents)){
			documents.forEach(newDocumentVal, i => {
				this.documentModel.findOneAndUpdate(documentKeys[i], newDocumentsVal);	
			});
		} else {
			this.documentModel.findOneAndUpdate(documentKeys, newDocumentsVals);	
		}
	}
	
	Delete(documents){
		if (Array.isArray(documents)){
			documents.forEach(document => {
				this.documentModel.deleteOne(document);
			});
		} else {
			this.documentModel.deleteOne(documents);
		}
	}
}
module.exports = Repository;