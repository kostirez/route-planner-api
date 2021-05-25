import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import MHDService from "./MHD.service";

export class MHDRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'MHDRoutes');
    }

    configureRoutes() {

        this.app.route(`/MHDStops`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await MHDService.getStopsInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });

        this.app.route(`/metro`)
            .get(async (req: express.Request, res: express.Response) => {
                console.log('metro');
                const data = await MHDService.getMetroInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });
        this.app.route(`/tram`)
            .get(async (req: express.Request, res: express.Response) => {
                console.log('tram');
                const data = await MHDService.getTramInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });
        this.app.route(`/bus`)
            .get(async (req: express.Request, res: express.Response) => {
                console.log('bus');
                const data = await MHDService.getBusInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });
        // this.app.route(`/MHD/:MHDId`)
        //     .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        //         // this middleware function runs before any request
        //         // but it doesn't accomplish anything just yet---
        //         // it simply passes control to the next applicable function below using next()
        //         next();
        //     })
        //     .get(async (req: express.Request, res: express.Response) => {
        //         // res.status(200).send(`GET requested for id ${req.params.streetId}`);
        //         let data = await MHDService.getStopsInCircle("606b76a3b31a86148087b580");
        //         data = JSON.parse(data);
        //         res.status(200).send(data);
        //         // res.status(200).send(MHDService.getById);
        //     });

        return this.app;
    }

}
