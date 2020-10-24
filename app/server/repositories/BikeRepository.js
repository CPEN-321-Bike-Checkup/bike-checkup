class BikeRepository{

    constructor(bikeModel, userModel){
        this.bikeModel = bikeModel;
        this.userModel = this.userModel;
    }

    getBikes(query){
        //mongoose model is used like a repository
        return this.bikeModel.find(query).exec();
    }

    getOwner(bike){
        return this.userModel.findById(bike.owner).exec();
    }
}