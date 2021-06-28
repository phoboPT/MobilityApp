import { NotFoundError } from "@mobileorg/common-lib"
import express, { Request, Response } from "express"
import { Route } from "../models/route"
import {searchRoute} from "@mobileorg/common-lib"


const router = express.Router()

router.get('/api/routes/start/:start/end/:end', async (req: Request, res: Response) => {

    const allRoutes = await Route.find({})
    
    const paths=searchRoute(req.params.start,req.params.end,allRoutes,[])
  
    res.send(paths)

})

export { router as searchRouteRouter }