import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import GraphService from "./graph.service";

export class GraphRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "GraphRoutes");
    }

    configureRoutes() {

        // this.app.route(`/Graph`)
        //     .get(async (req: express.Request, res: express.Response) => {
        //         const data = await GraphService.getStopsInCircle([14.455354802000045, 50.122601872000075], 500);
        //         res.status(200).send(data);
        //     });
        //
        // this.app.route(`/Graph/All`)
        //     .get(async (req: express.Request, res: express.Response) => {
        //         const data = await GraphService.getStopsInCircle([14.455354802000045, 50.122601872000075], 1000);
        //         res.status(200).send(data);
        //     })

        return this.app;
    }

}
