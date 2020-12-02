const componentRepository = require('../repositories/ComponentRepository');

class ComponentService {
  constructor(componentRepository) {
    this.componentRepository = componentRepository;
  }

  GetAll() {
    return this.componentRepository.GetAll();
  }

  CreateComponents(components) {
    var promise = this.componentRepository.Create(components);
    return promise;
  }

  GetComponentsForBike(bikeId) {
    var promise = this.componentRepository.GetComponentsForBike(bikeId);
    return promise;
  }

  Update(component) {
    return new Promise(async (resolve, reject) => {
      var promise = await this.componentRepository.Update(component);
      resolve(promise);
    });
  }

  Delete(component) {
    var promise = this.componentRepository.Delete(component);
    return promise;
  }
}

const componentService = new ComponentService(componentRepository);
module.exports = componentService;
