import { filterRoutes } from './../lib/filterRoutes';
import express, { Request, Response } from 'express';
import { searchRoute } from '../lib/search';
import { routeAPI } from '../lib/routeAPI';
const router = express.Router();




router.get('/api/routes/start/:start/end/:end/:type', async (req: Request, res: Response) => {
    try {
        const before = Date.now();
        const { start, end, type } = req.params;
        let allPaths;
        // get CP journeys between 2 citys
        const { begin, stop, cpRoutes, allTargets } = await routeAPI(start, end, type);
        //search for possible paths given a start, end and all the routes
        allTargets.push(start)
        allTargets.push(end)
        if (cpRoutes) {
            allPaths = searchRoute(begin.name, stop.name, cpRoutes, allTargets);
        }
        //filter the results
        const filteredRoutes = filterRoutes(allPaths, cpRoutes);

        const after = Date.now();
        console.log('Route performed in ', (after - before) / 1000);

        res.send(filteredRoutes);
    } catch (error) {
        console.log(`error ${error}`);
    }
});

export { router as searchRouteRouter };
