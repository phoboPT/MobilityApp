import { filterRoutes } from './../lib/filterRoutes';
import express, { Request, Response } from 'express';
import { RouteDoc } from '../models/route';
import { searchRoute } from '../lib/search';
import { routeAPI } from '../lib/routeAPI';
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
    price: number;
}
interface IRoute {
    startLocation: string;
    endLocation: string;
    originId: string;
    destinationId: string;
    price: number;
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

router.get('/api/routes/start/:start/end/:end/:type', async (req: Request, res: Response) => {
    try {
        const before = Date.now();
        let { start, end, type } = req.params;
        // const allRoutes = await Route.find({ state: 'AVAILABLE' });
        let allPaths;

        const { begin, stop, cpRoutes, allTargets } = await routeAPI(start, end, type);
        //search for possible paths given a start, end and all the routes
        if (cpRoutes) {
            allPaths = searchRoute(begin.name, stop.name, cpRoutes, allTargets);
        }
        const routes = filterRoutes(allPaths, cpRoutes);

        const after = Date.now();
        console.log('Route performed in ', (after - before) / 1000);

        res.send(routes);
    } catch (error) {
        console.log(`error ${error}`);
    }
});

export { router as searchRouteRouter };
