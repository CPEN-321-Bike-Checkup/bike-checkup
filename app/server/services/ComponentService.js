const componentRepository = require('../repositories/ComponentRepository');

class ComponentService {
  constructor(componentRepository) {
    this.componentRepository = componentRepository;
  }

  async getComponents(bikeId) {
    return componentRepository.getComponents(bikeId);
  }
}

const componentService = new ComponentService(
  componentRepository,
);
module.exports = componentService;
