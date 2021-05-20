import express from "express";
import {CommonRoutesConfig} from "../common/common.routes.config";

import GraphService from "./graph.service";

export class GraphRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "GraphRoutes");
    }

    public configureRoutes() {
        this.app.route(`/Graph`)
            .get(async (req: express.Request, res: express.Response) => {
                try {
                    const stringFrom = req.query.from as string;
                    const stringTo = req.query.to as string;
                    const transportType = req.query.transportType as string;
                    console.log('transportType', transportType)
                    const arrayFrom = stringFrom.split(',');
                    const arrayTo = stringTo.split(',');
                    const from: [number, number] = [+arrayFrom[0], +arrayFrom[1]];
                    const to: [number, number] = [+arrayTo[0], +arrayTo[1]];
                    const data = await GraphService.getRoute(from, to, transportType);
                    res.status(200).send(data);
                } catch (e) {
                    res.status(400).send(e);
                }
            });

        return this.app;
    }

}
