import MongoService from "../common/mongo.service";

class MHDService {

    private collPID = "PID_Lines";
    private collStops = "MHD_stops";
    private collMetro = "metro";

    // MHD stops
    public async getStopById(id: string) {
        return MongoService.getById(id, this.collStops);
    }

    public async getStopsInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collStops);
    }

    public async getStopsByName(name) {
        const filtr = {"properties.ZAST_NAZEV": name};
        return MongoService.getMany(filtr, this.collStops);
    }

    // vlezi do metra
    public async getMetroEntranceById(id: string) {
        return MongoService.getById(id, this.collMetro);
    }

    public async getMetroEntranceInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collMetro);
    }

    // MHD routes
    public async getRouteById(id: string) {
        return MongoService.getById(id, this.collMetro);
    }

    public async getRouteByNumber(num) {
        const filtr = {"properties.LIN_CISLO": num};
        return MongoService.getMany(filtr, this.collMetro);
    }

}

export default new MHDService();
