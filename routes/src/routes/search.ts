import { NotFoundError } from "@mobileorg/common-lib"
import express, { Request, Response } from "express"
import { Route, RouteDoc } from "../models/route"
import { searchRoute } from "@mobileorg/common-lib"
interface IVisit {
    [key: string]: RouteDoc
}

const router = express.Router()

router.get('/api/routes/start/:start/end/:end', async (req: Request, res: Response) => {
    const before = Date.now();
    const { start, end } = req.params
    const allRoutes = await Route.find({})

    let allPaths
    let routeDetails: IVisit = {}
    if (allRoutes) {
        allPaths = searchRoute(start, end, allRoutes, [])

        allPaths.forEach((path): void => {
            path.split(',').forEach((subpath: any): void => {
                if (!routeDetails[subpath]) {
                    allRoutes.forEach(route => {
                        if (route.startLocation === subpath) {
                            routeDetails[route.startLocation] = route
                        }
                    })
                }
            })
        })
    }
    const response: RouteDoc[] = []
    allPaths?.forEach((path): void => {
        let tempArray: any = []
        path.split(',').forEach((subpath: any): void => {
            if (routeDetails[subpath]) {
                tempArray.push(routeDetails[subpath])
            }
        })
        tempArray.push(end)
        response.push(tempArray)
        tempArray = []
    })


    const after = Date.now();
    console.log('Route performed in ', (after - before) / 1000);
    // console.log(allPaths)
    res.send(response)
})

export { router as searchRouteRouter }