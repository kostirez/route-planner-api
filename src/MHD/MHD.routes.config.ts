import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import MHDService from "./MHD.service";

export class MHDRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'MHDRoutes');
    }

    configureRoutes() {

        this.app.route(`/MHD`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await MHDService.getStopsInCircle([14.455354802000045, 50.122601872000075], 500);
                res.status(200).send(data);
            });

        this.app.route(`/MHD/All`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await MHDService.getStopsInCircle([14.455354802000045, 50.122601872000075], 1000);
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
