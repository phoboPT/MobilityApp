import express, { Request, Response } from 'express';
import { Route, RouteDoc } from '../models/route';
import { searchRoute } from '@mobileorg/common-lib';
interface IVisit {
    [key: string]: RouteDoc;
}

const router = express.Router();

router.get('/api/routes/start/:start/end/:end', async (req: Request, res: Response) => {
    const before = Date.now();
    const { start, end } = req.params;
    const allRoutes = await Route.find({state:"AVAILABLE"});

    let allPaths;
    let routeDetails: IVisit = {};
    if (allRoutes) {
        allPaths = searchRoute(start, end, allRoutes, []);
        //split the routes to populate later
        allPaths.forEach((path): void => {
            path.split(',').forEach((subpath: any): void => {
                if (!routeDetails[subpath]) {
                    allRoutes.forEach((route) => {
                        if (route.startLocation === subpath) {
                            routeDetails[route.startLocation] = route;
                        }
                    });
                }
            });
        });
    }
    console.log(allPaths)
    const unfilteredData: any[] = [];
    //populate the array with the data
    allPaths?.forEach((path): void => {
        let tempArray: any = [];
        path.split(',').forEach((subpath: any): void => {
            if (routeDetails[subpath]) {
                tempArray.push(routeDetails[subpath]);
            }
        });
        
        tempArray.push(end);
        unfilteredData.push(tempArray);
        tempArray = [];
    });

    unfilteredData.forEach((item: any, index): void => {
        //for ecah item verify if the startDate is greater than the first element startDate
        const startDate: string = item[0].startDate;
        let found = 0
        item.forEach((route: any): void => {
            if (route.startDate < startDate) {
                found += 1;
            }
        })
        if (found > 0) {
            delete unfilteredData[index]
        }

    })
    const filteredData = unfilteredData.filter((item: any) => {

        return item
    })

    const after = Date.now();
    console.log('Route performed in ', (after - before) / 1000);
    // console.log(allPaths)
    res.send(filteredData);
});

export { router as searchRouteRouter };
