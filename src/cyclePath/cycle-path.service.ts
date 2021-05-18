import MongoService from "./../common/mongo.service";

class CyclePathService {

    private collection = "cycle_path";

    public async getPathById(id: string) {
        return MongoService.getById(id, this.collection);
    }

    public async getPathInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collection);
    }
}

export default new CyclePathService();
