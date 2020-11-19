const componentRepository = require('../repositories/ComponentRepository');

class ComponentService {
  constructor(componentRepository) {
    this.componentRepository = componentRepository;
  }

  GetComponentsForBike(bikeId) {
    return this.componentRepository.GetComponentsForBike(bikeId);
  }
}

const componentService = new ComponentService(componentRepository);
module.exports = componentService;
