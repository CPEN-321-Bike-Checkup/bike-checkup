class Repository{

	constructor(documentModel){
		this.documentModel = documentModel;
	}

	GetById(id){
		console.log("\n\n GetById \n\n")
		console.log(this.documentModel.findById(69, 'bikes'));
		return this.documentModel.findById(id);
	}
	
	Create(documents){
		return this.documentModel.create(documents);	
	}

	Update(documentKeys, newDocumentsVals){
		var promises = [];
		if (Array.isArray(documents)){
			documents.forEach(newDocumentVal, i => {
				promises.add(this.documentModel.findOneAndUpdate(documentKeys[i], newDocumentsVal).exec());	
			});
			return promises;
		} else {
			return this.documentModel.findOneAndUpdate(documentKeys, newDocumentsVals).exec();	
		}
	}
	
	Delete(documents){
		var promises = [];
		if (Array.isArray(documents)){
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