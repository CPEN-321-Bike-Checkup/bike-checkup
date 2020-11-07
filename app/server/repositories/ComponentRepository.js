const Repository = require('./Repository');
const ComponentModel = require('../schemas/Component').ComponentModel;

class ComponentRepository extends Repository{

	constructor(componentModel){
		super(componentModel);
	}
	
	GetByBikeId(bikeId){
		this.documentModel.find({bike: bikeId}).exec();	
	}
}
const componentRepository = new ComponentRepository(componentModel);
module.exports = componentRepository;