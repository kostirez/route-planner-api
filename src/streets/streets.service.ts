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

    public async getStreetInCircle(lan, lat, radius) {
        const filtr = null; // TODO dodefinovat
        return MongoService.getMany(filtr, this.collName);
    }
}

export default new StreetsService();
