import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";
import StreetsService from "./streets.service";

export class StreetsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'StreetsRoutes');
    }

    configureRoutes() {

        this.app.route(`/streets`)
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`List of streets`);
            });

        this.app.route(`/streets/:streetId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request
                // but it doesn't accomplish anything just yet---
                // it simply passes control to the next applicable function below using next()
                next();
            })
            .get(async (req: express.Request, res: express.Response) => {
                // res.status(200).send(`GET requested for id ${req.params.streetId}`);
                const data = await StreetsService.getStreetById(req.params.streetId);
                res.status(200).send(data);
                // res.status(200).send(StreetsService.getById);
            });

        return this.app;
    }

}
