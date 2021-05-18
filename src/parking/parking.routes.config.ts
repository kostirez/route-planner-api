import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import ParkingService from "./parking.service";

export class ParkingRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'ParkingRoutes');
    }

    configureRoutes() {

        this.app.route(`/Parking`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getParkomatyInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        this.app.route(`/Parking/All`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getAllInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });
        this.app.route(`/Parking/:parkingId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                next();
            })
            .get(async (req: express.Request, res: express.Response) => {
                // res.status(200).send(`GET requested for id ${req.params.streetId}`);
                let data = await ParkingService.getParkomatyById("606b76a3b31a86148087b580");
                data = JSON.parse(data);
                res.status(200).send(data);
                // res.status(200).send(ParkingService.getById);
            });

        this.app.route(`/ZTP`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getZTPInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        this.app.route(`/ZakazStani`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getZakazStaniInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        this.app.route(`/placene_parkovani`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getZonesInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        this.app.route(`/parkingLot`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await ParkingService
                    .getParkingInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        return this.app;
    }

}
