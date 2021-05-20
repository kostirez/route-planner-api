import {ObjectID} from "mongodb";
import MongoService from "../common/mongo.service";
import GraphController from "./graph.controller";

class GraphService {

    private collName = "graph";
    private collNodes = "street_graph_nodes";
    private collLinks = "streets";

    public async getRoute(from: [number, number], to: [number, number], transpotType: string) {
        return await GraphController.getRoute(from, to, transpotType);
    }

    public async getGraphStreetById(id: string) {
        // console.log('id', id);
        return await MongoService.getById(id, this.collName);
    }

    public async getGraphStreetByCoordinates(coor: [number, number]) {
        const filtr = {$or: [{end: coor}, {start: coor}]};
        return await MongoService.getMany(filtr, this.collName);
    }

    public async getNodeById(id: string) {
        return await MongoService.getById(id, this.collNodes);
    }

    public getNearestNode(coords: [number, number]) {
        // console.log('coords', coords);
        const filter = {
            coords:
                {
                    $near:
                        {
                            $geometry: {type: "Point", coordinates: coords},
                            $minDistance: 0,
                            $maxDistance: 1000,
                        },
                },
        }
        return MongoService.getOne(filter, this.collNodes);
    }

    public async getNeighboursNodes(node) {
        // console.log('sousedi id', node.neighbours);
        const objectIds = [];
        node.neighbours.forEach((neighbor) => {
            objectIds.push(new ObjectID(neighbor));
        });
        const filter = {'_id': {'$in': objectIds}};
        // console.log('filter', filter);
        return await MongoService.getMany(filter, this.collNodes);
    }

    public async getLink(firstNodeId, secondNodeId): Promise<any> {
        // console.log('id', firstNodeId);
        // console.log('id', new ObjectID(firstNodeId));
        let filter = {'nodes': {'$all': [new ObjectID(firstNodeId), new ObjectID(secondNodeId)]}};
        // console.log('filter', filter);
        return await MongoService.getOne(filter, this.collLinks);
    }


}

export default new GraphService();
