import MongoService from "../common/mongo.service";
import GraphController from "./graph.controller";

class GraphService {

    private collName = "graph";

    public async getRoute(from: [number, number], to: [number, number]) {
        return await GraphController.getRoute(from, to);
    }

    public async getGraphStreetById(id: string) {
        return MongoService.getById(id, this.collName);
    }

    public async getGraphStreetByCoordinates(coor: [number, number]) {
        const filtr = { $or: [ {end: coor}, {start: coor} ] };
        return MongoService.getMany(filtr, this.collName);
    }
}

export default new GraphService();
