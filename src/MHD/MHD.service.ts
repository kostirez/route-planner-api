import MongoService from "../common/mongo.service";

class MHDService {

    private collPID = "PID_Lines";
    private collStops = "MHDStops";
    private collMetro = "metro_lines";
    private collTram = "tram_lines";
    private collBus = "bus_lines";

    // MHD stops
    public async getStopById(id: string) {
        return MongoService.getById(id, this.collStops);
    }

    public async getStopsInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        console.log('filtr', filtr);
        console.log('this.collStops', this.collStops);
        return MongoService.getMany(filtr, this.collStops);
    }


    public async getMetroInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        // console.log('this.collStops', this.collMetro);
        return MongoService.getMany(filtr, this.collMetro);
    }

    public async getTramInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        // console.log('this.collStops', this.collMetro);
        return MongoService.getMany(filtr, this.collTram);
    }

    public async getBusInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        // console.log('this.collStops', this.collMetro);
        return MongoService.getMany(filtr, this.collBus);
    }


    // public async getStopsByName(name) {
    //     const filtr = {"properties.ZAST_NAZEV": name};
    //     return MongoService.getMany(filtr, this.collStops);
    // }
    //
    // // vlezi do metra
    // public async getMetroEntranceById(id: string) {
    //     return MongoService.getById(id, this.collMetro);
    // }
    //
    // public async getMetroEntranceInCircle(coordinates, radius) {
    //     const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
    //     return MongoService.getMany(filtr, this.collMetro);
    // }
    //
    // // MHD routes
    // public async getRouteById(id: string) {
    //     return MongoService.getById(id, this.collMetro);
    // }
    //
    // public async getRouteByNumber(num) {
    //     const filtr = {"properties.LIN_CISLO": num};
    //     return MongoService.getMany(filtr, this.collMetro);
    // }

}

export default new MHDService();
