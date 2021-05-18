import {tab} from "./priceTable";
import GraphService from "./graph.service";

class GraphController {

    public async getRoute(from: [number, number], to: [number, number], transportType: string) {

        // console.log('from', from);
        // console.log('to', to);

        const start = await GraphService.getNearestNode(from);
        const end = await GraphService.getNearestNode(to);

        // console.log("start", start);
        // console.log("end", end);
        return await this.findPath(start, end, transportType);
    }

    private async findPath(start: any, end: any, transportType: string) {

        // Inicializují se 2 prázdné listy.
        const openList = [];  // ukladání otevřených uzlů z kterých probíhá vyhledávání
        const closeList = []; // uzavřené uzly kterými již algoritmus prošel

        start.g = 0; // nastavení hodnoty cesty do startovního budu na nulu
        openList.push(start); // do openlistu je vložen počáteční uzel.

        // poběží dokud není nalezen koncový uzel
        while (true) {
            // for (let i = 0; i < 120; i++) {
            //Nalezení nejlepšího uzlu mezi otevřenými uzly a následné přesunutí mezi uzavřené
            const currentNodeId = await this.findBestNodeId(openList);
            const currentNode = openList[currentNodeId];
            openList.splice(currentNodeId, 1);
            closeList.push(currentNode);

            // je nalezený uzel koncový?
            if (String(end._id) === String(currentNode._id)) {
                console.log('found');
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


                // const price = await this.pathPrice(node, currentNode);
                // výpočet hodnot uzlu
                    // g = nejkratší vzdálenost po cestách z počátečního uzlu
                    // h = vzdušná vzdálenos uzlu od koncovéhoo uzlu
                node.g = currentNode.g + await this.pathPrice(currentNode, node, transportType);
                node.h = this.calculateDist(end.coords, node.coords);
                node.f = node.g + node.h;
                node.parrentId = currentNode._id;
                // console.log('g', node.g);
                // console.log('h', node.h);
                // console.log('f', node.f);

                // is in openList
                // console.log('check open list');
                // pokud je jiz v uzel v openlist a zaroven do nej vede
                // kratsi cesta nez v tomto pripade, je uzel zahozen.
                // v opacnem pripade je  pridán do openlistu
                if (this.includeNode(openList, node)) {
                    // console.log('includde1');
                    // is it better than a current node in openList?
                    const foundNode = openList.find((n) => String(n._id) === String(node._id));
                    if (node.g > foundNode.g) {
                        // console.log('includde2');
                        continue;
                        // return;
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
        // console.log('closelist', closeList.map((node) => {
        //     return {id: node.id, f: node.parrentId};
        // }));
        // console.log('openlist', openList.map((node) => {
        //     return {id: node.id, f: node.parrentId};
        // }));

        // return closeList.map((node) => {
        //     return {
        //         "type": "Feature",
        //         "geometry": {
        //             "type": "Point",
        //             "coordinates": node.coords,
        //         },
        //         "properties": {},
        //     };
        // });

        let current = closeList[closeList.length - 1];

        // return closeList;
        const route = [];
        while (String(current._id) !== String(closeList[0]._id)) {
            route.push(current._id);
            //     {
            //     "type": "Feature",
            //     "geometry": {
            //         "type": "Point",
            //         "coordinates": current.coords,
            //     },
            //     "properties": {},
            // }

            const next = closeList.find((n) => String(n._id) === String(current.parrentId));
            current = next;
        }
        // console.log('route len: ', route.length);
        // console.log('closeList len: ', closeList.length);
        const links = [];

        for (let i = 0; i < route.length - 1; i++) {
            // console.log(route[i]);
            links.push(await this.getLink(route[i], route[i + 1]));
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
        // console.log("index", index);
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
            if (first.coords[1] === path.geometry.coordinates[0][1] && path.properties.SMEROVOST === 1) {
                // console.log('exist21');
                multiplier = 100000;
            } else {
                if (second.coords[1] === path.geometry.coordinates[0][1] && path.properties.SMEROVOST === 2) {
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
        return price ;
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
