import express from "express";
import graphService from "./graph.service";


class GraphController {

    public async getRoute(from: [number, number], to: [number, number]) {

        // init
        const routes: Array<{price: number, ids: string[], last: [number, number]}> = [];

        // let finish = false;
        // let bestR = from;
        // while (!finish) {
        //     const nextStreets: [] = await graphService.getGraphStreetByCoordinates(bestR);
        //     nextStreets.forEach((s) => {
        //         {price: s.length, ids: string, last: [number, number]}
        //     })
        //     // find best route so far
        //     let min = routes[0].price;
        //     let best = 0;
        //     routes.forEach((r, index) => {
        //         if (min > r.price) {
        //             min = r.price;
        //             best = index;
        //         }
        //     });
        //
        //
        //
        // }
        //
        // let best = from;
        // const nextStreets: [] = await graphService.getGraphStreetByCoordinates(best);
        // nextStreets.forEach((street) => {
        //
        // })
    }

}

export default new GraphController();
