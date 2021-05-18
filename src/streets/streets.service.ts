import MongoService from "../common/mongo.service";

class StreetsService {

    private collName = "streets";

    public async getStreetByName(name: string) {
        const filtr = null; // TODO dodefinovat
        const data = await MongoService.getOne(filtr, this.collName);
        return data;
    }

    public async getStreetById(id: string) {
        return MongoService.getById(id, this.collName);
    }

    public async getStreetsInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collName);
    }

    public async getpesiInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, 'pesi');
    }
}

export default new StreetsService();
