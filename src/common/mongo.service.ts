import {MongoClient, ObjectID} from "mongodb";

class MongoService {

    public mongoUrl: string = "mongodb+srv://test:test@cluster0.uniyp.mongodb.net/test?retryWrites=true&w=majority";

    private db;

    private client;

    constructor() {
        this.client = new MongoClient(this.mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        this.runMongo().catch(console.dir);
    }

    public async getById(id: string, coll: string) {
        const collection = this.db.collection(coll);
        const o_id = new ObjectID(id);
        const data = await collection.findOne({_id: o_id});
        console.log(data);
        return data;
    }

    public async getOne(filtr: {}, coll: string) {
        const collection = this.db.collection(coll);
        const data = await collection.findOne(filtr);
        console.log(data);
        return data;
    }

    public async getMany(filtr, coll: string) {
        const collection = this.db.collection(coll);
        return collection.find(filtr).toArray();
    }

    private async runMongo() {
        try {
            // Connect the client to the server
            await this.client.connect();
            // Establish and verify connection
            await this.client.db("admin").command({ping: 1});
            console.log("Connected successfully to server");
            this.db = this.client.db("geoData");
        } catch (e) {
            console.log("error: ", e);
        }
        // finally {
        //     // Ensures that the client will close when you finish/error
        //     await this.client.close();
        //     console.log("close the server");
        // }
    }

    public getNearByFilter(coor: [number, number], minDist: number, maxDist: number) {
        return {
            geometry:
                {
                    $near:
                        {
                            $geometry: {type: "Point", coordinates: coor},
                            $minDistance: minDist,
                            $maxDistance: maxDist
                        }
                }
        }
    }

}

export default new MongoService();
