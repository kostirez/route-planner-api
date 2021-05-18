import express from "express";
import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import {CommonRoutesConfig} from "./common/common.routes.config";
import {CyclePathRoutes} from "./cyclePath/cycle-path.routes.config";
import {GraphRoutes} from "./graph/graph.routes.config";
import {MHDRoutes} from "./MHD/MHD.routes.config";
import {ParkingRoutes} from "./parking/parking.routes.config";
import {StreetsRoutes} from "./streets/streets.routes.config";
import debug from "debug";

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({all: true})
    ),
};

// here we are crashing on unhandled errors and spitting out a stack trace,
// but only when in debug mode
if (process.env.DEBUG) {
    process.on('unhandledRejection', function(reason) {
        debugLog('Unhandled Rejection:', reason);
        process.exit(1);
    });
} else {
    loggerOptions.meta = false; // when not debugging, make terse
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new StreetsRoutes(app));
routes.push(new ParkingRoutes(app));
routes.push(new MHDRoutes(app));
routes.push(new GraphRoutes(app));
routes.push(new CyclePathRoutes(app));

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server up and running!`);
});
server.listen(port, () => {
    debugLog(`Server running at http://localhost:${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`);
    });
});
