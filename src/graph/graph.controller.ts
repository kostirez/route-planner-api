const request = require('request');
import * as https from "http";
import GraphService from "./graph.service";
import {tab} from "./priceTable";

class GraphController {

    public async getRoute(from: [number, number], to: [number, number], transportType: string) {


        // console.log('bike', coords);
        console.log('get request', transportType);
        // console.log('to', to);
        // if (!transportType) {
        //     console.log('fail');
        //     return;
        // }
        // const coords = await this.findNearest(from, 'bike');
        // console.log('coords', coords);
        // const bike = await GraphService.getNearestNode(coords);
        const start = await GraphService.getNearestNode(from);
        const end = await GraphService.getNearestNode(to);
        //
        // if (transportType === 'shareBike') {
        //     console.log('bike', bike);
        //     const toBike = await this.findPath(start, bike, 'walk');
        //     const toEnd = await this.findPath(bike, end, 'bike');
        //     console.log('return', toBike.concat(toEnd));
        //     return toBike.concat(toEnd);
        // } else {
        return await this.findPath(start, end, transportType);
        // }
        //
        // // console.log("start", start);
        // // console.log("end", end);
        //
    }

    private findNearest(coords: [number, number], type: string): Promise<[number,number]> {
        return new Promise<[number, number]>((resolve, reject) => {
            console.log('coords', coords);
            request({
                method: 'GET',
                url: 'https://api.golemio.cz/v2/sharedcars/' +
                    '?latlng=' + coords[0] + ',' + coords[1] +
                    '$range=1000' +
                    '&limit=1',
                headers: {
                    'content-type': 'application/json; charset=utf-8',
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hcnRpbi5rb3N0b2hyeXpAZ21haWwuY29tIiwiaWQiOjU2NiwibmFtZSI6bnVsbCwic3VybmFtZSI6bnVsbCwiaWF0IjoxNjExMTM0OTQ3LCJleHAiOjExNjExMTM0OTQ3LCJpc3MiOiJnb2xlbWlvIiwianRpIjoiNDA1MTkzYWMtMjIwYS00ZGRjLTkxYmMtMDBjODQ3NzZlNzg2In0.bYg3gopShLJDOHBOAAU96F7IcXJWHBSZbhgD-UgJfeQ'
                }
            }, (error, response, body) => {
                let ret = JSON.parse(body);
                if (!ret.features || ret.features.length === 0){
                    console.log('not found:');
                    reject('error');
                    return;
                }
                ret = ret.features[0].geometry.coordinates;
                console.log('Response:', ret);
                resolve(ret);
            });
        });

    }

    private async findPath(start: any, end: any, transportType: string) {
        // Inicializují se 2 prázdné listy.
        const openList = [];  // ukladání otevřených uzlů z kterých probíhá vyhledávání
        const closeList = []; // uzavřené uzly kterými již algoritmus prošel

        start.g = 0; // nastavení hodnoty cesty do startovního budu na nulu
        openList.push(start); // do openlistu je vložen počáteční uzel.
        // poběží dokud není nalezen koncový uzel
        while (true) {
            // Nalezení nejlepšího uzlu mezi otevřenými uzly a následné přesunutí mezi uzavřené
            const currentNodeId = await this.findBestNodeId(openList);
            const currentNode = openList[currentNodeId];
            openList.splice(currentNodeId, 1);
            closeList.push(currentNode);
            // je nalezený uzel koncový?
            if (String(end._id) === String(currentNode._id)) {
                break;  // ukončí vyhledávání
            }
            // nalezne okolní uzly do kterých vede cesta z currentNode
            const adjacantNodes = await this.findNextNodes(currentNode);
            // cyklus skrz všechny nalezený sousedy
            for (const node of adjacantNodes) {
                // pokud je uzel již uzavřený jde se na dalšího
                if (this.includeNode(closeList, node)) {
                    continue;
                }
               // výpočet hodnot uzlu
                // g = nejkratší vzdálenost po cestách z počátečního uzlu
                // h = vzdušná vzdálenos uzlu od koncovéhoo uzlu
                node.g = currentNode.g + await this.pathPrice(currentNode, node, transportType);
                node.h = this.calculateDist(end.coords, node.coords);
                node.f = node.g + node.h;
                node.parrentId = currentNode._id;
                // pokud je jiz v uzel v openlist a zaroven do nej vede
                // kratsi cesta nez v tomto pripade, je uzel zahozen.
                // v opacnem pripade je  pridán do openlistu
                if (this.includeNode(openList, node)) {
                    // console.log('includde1');
                    // is it better than a current node in openList?
                    const foundNode = openList.find((n) => String(n._id) === String(node._id));
                    if (node.g > foundNode.g) {
                        continue;
                    } else {
                        const index = openList.findIndex((n) => String(n._id) === String(node._id));
                        openList.splice(index, 1);
                        openList.push(node);
                    }
                } else {
                    openList.push(node);
                }
            }
        }

        let current = closeList[closeList.length - 1];
        const route = [];
        while (String(current._id) !== String(closeList[0]._id)) {
            route.push(current._id);
            const next = closeList.find((n) => String(n._id) === String(current.parrentId));
            current = next;
        }
        const links = [];
        for (let i = 0; i < route.length - 1; i++) {
            // console.log(route[i]);
            const link = await this.getLink(route[i], route[i + 1]);
            link.properties.transportType = transportType;
            links.push(link);
        }
        return links;
    }

    private findBestNodeId(list: any[]): number {
        let min = Number.MAX_SAFE_INTEGER;
        let i = 0;
        let index = 0;
        list.forEach((node) => {
            if (node.f < min) {
                min = node.f;
                index = i;
            }
            i++;
        });
        return index;
    }

    private async pathPrice(first, second, transportType: string): Promise<number> {
        // database find link...

        const path = await GraphService.getLink(first._id, second._id);
        // console.log('path', path);
        // data.links.find((link) => link.nodes.includes(first.id)
        // && link.nodes.includes(second.id));
        // console.log('trans: ', transportType);
        let multiplier = tab[path.properties.TYPKOMUNIK][transportType];

        if (path.properties.SMEROVOST) {

            // console.log('smer: ', path.properties.SMEROVOST);
            // console.log('exist', first.coords[1], path.geometry.coordinates[0][1]);
            if (first.coords[1] === path.geometry.coordinates[0][1] && path.properties.SMEROVOST === 2) {
                // console.log('exist21');
                multiplier = 100000;
            } else {
                if (second.coords[1] === path.geometry.coordinates[0][1] && path.properties.SMEROVOST === 1) {
                    // console.log('exist22');
                    multiplier = 100000;
                }
            }
        }
        // const key = "bike";
        // console.log('tab', tab);
        const price = path.properties.Shape_Length * 12000 * multiplier;
        // console.log('multi: ', multiplier);
        // console.log('PRICE: ', price);
        return price;
    }

    private async getLink(firstNodeId, secondNodeId) {
        return await GraphService.getLink(firstNodeId, secondNodeId);
    }

    private calculateDist(end, current): number {
        // const endPrice = Math.pow(Math.pow(end.coords[0], 2) + Math.pow(end.coords[1], 2), 0.5);
        // const currentPrice = Math.pow(Math.pow(current.coords[0], 2) + Math.pow(current.coords[1], 0.5), 2);
        // console.log('edn', end);
        // console.log('end price', endPrice);
        // console.log('currentPrice', currentPrice);

        const R = 6371e3; // metres
        const fi1 = end[1] * Math.PI / 180; // φ, λ in radians
        const fi2 = current[1] * Math.PI / 180;
        const deltaFi = (current[1] - end[1]) * Math.PI / 180;
        const deltaPsi = (current[0] - end[0]) * Math.PI / 180;
        const a = Math.sin(deltaFi / 2) * Math.sin(deltaFi / 2) +
            Math.cos(fi1) * Math.cos(fi2) *
            Math.sin(deltaPsi / 2) * Math.sin(deltaPsi / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // in metres

        // return Math.abs(endPrice - currentPrice);
    }

    private async findNextNodes(currentNode) {
        let retNodes;
        // database find nodes that include currentNode.id in neighbours
        retNodes = await GraphService.getNeighboursNodes(currentNode);
        // console.log("nodes: ", retNodes);
        return retNodes;
        // data.nodes
        //     .filter((node) => node.links.includes(currentNode.id))
        //     .forEach((n) => {
        //         retNodes.push({
        //             id: n.id,
        //             coords: n.coords,
        //             h: n.h,
        //             g: n.g,
        //             f: n.f,
        //             links: n.links,
        //         });
        //     });
        // return retNodes;
    }

    private includeNode(listOfNodes, node): boolean {
        let ret = false;
        // console.log('node', node);
        // console.log('listOfNodes', listOfNodes.map((n) => n._id));
        // console.log('node id', node._id);
        listOfNodes.forEach((item) => {
            // console.log('item id', node._id);
            if (String(item._id) === String(node._id)) {
                ret = true;
                // console.log('jsem tu');
            }
        });
        return ret;
    }

    private async findNodeById(id: any) {
        return await GraphService.getNodeById(id);
    }
}

export default new GraphController();
