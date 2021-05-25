import MongoService from "./../common/mongo.service";

class ParkingService {

    private collParking = "parkoviste";
    private collParkomaty = "parkomaty";
    private collStaniZTP = "stani_ZTP";
    private collZakazStani = "zakaz_stani";
    private collZones = "placene_parkovani";

    // parking lot
    public async getParkingById(id: string) {
        return MongoService.getById(id, this.collParking);
    }

    public async getParkingInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        console.log('filtr', filtr);
        console.log('coll', this.collParking);
        return MongoService.getMany(filtr, this.collParking);
    }

    // ZTP
    public async getZTPById(id: string) {
        return MongoService.getById(id, this.collStaniZTP);
    }

    public async getZTPInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collStaniZTP);
    }

    // zakaz stani
    public async getZakazStaniById(id: string) {
        return MongoService.getById(id, this.collZakazStani);
    }

    public async getZakazStaniInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collZakazStani);
    }

    // zony
    public async getZonesById(id: string) {
        return MongoService.getById(id, this.collZones);
    }

    public async getZonesInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        return MongoService.getMany(filtr, this.collZones);
    }

    //parkomaty
    public async getParkomatyById(id: string) {
        return MongoService.getById(id, this.collParkomaty);
    }

    public async getParkomatyInCircle(coordinates, radius) {
        const filtr = MongoService.getNearByFilter(coordinates, 0, radius);
        console.log('filtr', filtr);
        console.log('coll', this.collParkomaty);
        return MongoService.getMany(filtr, this.collParkomaty);
    }

    // all

    public async getAllInCircle(coordinates, radius) {
        const filtr =  MongoService.getNearByFilter(coordinates, 0, radius);
        const parkomaty: [] = await MongoService.getMany(filtr, this.collParkomaty);
        const parkingLot = await MongoService.getMany(filtr, this.collParking);
        const ZTP = await MongoService.getMany(filtr, this.collStaniZTP);
        const zakazStani =  await MongoService.getMany(filtr, this.collZakazStani);
        // const zones = await MongoService.getMany(filtr, this.collZones);
        return  parkomaty.concat(parkingLot, ZTP, zakazStani);
    }
}

export default new ParkingService();
