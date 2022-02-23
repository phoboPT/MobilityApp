import { filterRoutes } from './../lib/filterRoutes';
import express, { Request, Response } from 'express';
import { searchRoute } from '../lib/searchGraph';
import routeAPI from '../lib/routeAPI';
const router = express.Router();
import { ILatLong } from '../interfaces/interfaces';
router.get('/api/routes/start/:start/end/:end/:type', async (req: Request, res: Response) => {
  try {
    const before = Date.now();
    const { type } = req.params;
    // const splitStart = req.params.start.split(',');
    // const splitEnd = req.params.end.split(',');
    // const start = { lat: parseFloat(splitStart[0]), long: parseFloat(splitStart[1]) };
    // const end: ILatLong = { lat: parseFloat(splitEnd[0]), long: parseFloat(splitEnd[1]) };
    // console.log(start, end);
    let allPaths;
    // get CP journeys between 2 citys
    const { begin, stop, cpRoutes, allTargets } = await routeAPI(req.params.start, req.params.end, type);
    //search for possible paths given a start, end and all the routes
    allTargets.push(req.params.start);
    allTargets.push(req.params.end);
    if (cpRoutes) {
      allPaths = searchRoute(req.params.start, req.params.end, cpRoutes, allTargets);
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
