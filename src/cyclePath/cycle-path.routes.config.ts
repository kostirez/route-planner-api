import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import CyclePathService from "./cycle-path.service";

export class CyclePathRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'CyclePath');
    }

    configureRoutes() {

        this.app.route(`/cyclePath`)
            .get(async (req: express.Request, res: express.Response) => {
                const data = await CyclePathService
                    .getPathInCircle([+req.query.coordinates1, +req.query.coordinates2], +req.query.radius);
                res.status(200).send(data);
            });
        return this.app;
    }

}
