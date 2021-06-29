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


    let paths
    let final: IVisit = {}
    if (allRoutes) {
        paths = searchRoute(start, end, allRoutes, [])


        paths.forEach((path): void => {
            path.split(',').forEach((subpath: any): void => {


                if (final[subpath]) {
                    console.log("hey")
                } else {
                    allRoutes.forEach(route => {
                        console.log(route.startLocation === subpath)
                        if (route.startLocation === subpath) {

                            final[route.startLocation] = route
                        }

                    })
                }
            })

        })
    }
    const response: RouteDoc[] = []
    paths?.forEach((path): void => {
        let temp: any = []
        path.split(',').forEach((subpath: any): void => {
            if (final[subpath]) {
                temp.push(final[subpath])
            }
        })
        temp.push(end)
        response.push(temp)

        temp = []

    })
    console.log(response)
    console.log(paths)

    const after = Date.now();
    console.log('Route performed in ', (after - before) / 1000);



    res.send(response)

})

export { router as searchRouteRouter }