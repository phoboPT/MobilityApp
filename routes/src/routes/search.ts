import express, { Request, Response } from 'express';
import { RouteDoc } from '../models/route';
import { searchRoute } from '../lib/search';
const comboios = require('comboios');
const router = express.Router();
interface IVisit {
    [key: string]: RouteDoc;
}
interface ILegDetails {
    name: string;
    id: string;
}
interface ILeg {
    origin: ILegDetails;
    destination: ILegDetails;
}
interface IRoute {
    startLocation: string;
    endLocation: string;
    originId: string;
    destinationId: string;
}
interface IRoutes extends Array<IRoute> {
    legs?: [ILeg];
    price?: number;
}

interface IStation {
    id: string;
    name: string;
}

interface IStations extends Array<IStation> {}

router.get('/api/routes/start/:start/end/:end', async (req: Request, res: Response) => {
    const before = Date.now();
    const { start, end } = req.params;
    // const allRoutes = await Route.find({ state: 'AVAILABLE' });
    const allRoutes: IRoutes = [];
    let allPaths;
    let routeDetails: IVisit = {};

    const allStations: IStations = await comboios.stations();
    const allTargets: string[] = [];
    const begin = { id: '', name: '' };
    const stop = { id: '', name: '' };

    allStations.forEach((station: IStation): void => {
        allTargets.push(station.name);

        if (station.name.includes(start)) {
            begin.id = station.id;
            begin.name = station.name;
        }
        if (station.name.includes(end)) {
            stop.id = station.id;
            stop.name = station.name;
        }
    });
    const journeys: [IRoutes] = await comboios.journeys(begin.id, stop.id, { when: new Date('2021-10-14') });
    //filter journeys
    journeys.map((journey: IRoutes): void => {
        journey.legs?.map((leg: ILeg) => {
            let found = false;
            allRoutes?.forEach((element: IRoute) => {
                if (element.startLocation === leg.origin.name && element.endLocation === leg.destination.name) {
                    found = true;
                }
            });
            if (!found) {
                allRoutes.push({
                    startLocation: leg.origin.name,
                    endLocation: leg.destination.name,
                    originId: leg.origin.id,
                    destinationId: leg.destination.id,
                    //leg: leg,
                    // price: journey.price,
                });
            }
        });
    });
    //search for possible paths given a start, end and all the routes
    if (allRoutes) {
        allPaths = searchRoute(begin.name, stop.name, allRoutes, allTargets);
        // console.log(allPaths);
        //split the routes to populate later
        allPaths.forEach((path): void => {
            path.split(',').forEach((subpath: any): void => {
                if (!routeDetails[subpath]) {
                    allRoutes.forEach((route: any) => {
                        if (route.startLocation === subpath) {
                            routeDetails[route.startLocation] = route;
                            console.log(`routeDetails: ${JSON.stringify(routeDetails)}, route: ${route}`);
                        }
                    });
                }
            });
        });
    }

    // const unfilteredData: any[] = [];
    // //populate the array with the data
    // allPaths?.forEach((path): void => {
    //     let tempArray: any = [];
    //     path.split(',').forEach((subpath: any): void => {
    //         if (routeDetails[subpath]) {
    //             tempArray.push(routeDetails[subpath]);
    //         }
    //     });

    //     tempArray.push(end);
    //     unfilteredData.push(tempArray);
    //     tempArray = [];
    // });

    // unfilteredData.forEach((item: any, index): void => {
    //     //for ecah item verify if the startDate is greater than the first element startDate
    //     const startDate: string = item[0].startDate;
    //     let found = 0;
    //     item.forEach((route: any): void => {
    //         if (route.startDate < startDate) {
    //             found += 1;
    //         }
    //     });
    //     if (found > 0) {
    //         delete unfilteredData[index];
    //     }

    //     delete item[item.length - 1];
    // });
    // const filteredData = unfilteredData.filter((item: any) => {
    //     return item;
    // });

    const after = Date.now();
    console.log('Route performed in ', (after - before) / 1000);

    res.send(allPaths);
});

export { router as searchRouteRouter };
