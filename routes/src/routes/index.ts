import { requiredAuth } from "@mobileorg/common-lib"
import express, { Response, Request } from "express"
import { Route } from "../models/route"

const router = express.Router()

router.get('/api/routes', requiredAuth, async (req: Request, res: Response) => {
    const route = await Route.find({})
    res.send(route)
})

router.get('/api/routes/user', requiredAuth, async (req: Request, res: Response) => {
    const route = await Route.find({where:{userId:req.currentUser!.id}})
    console.log(route)
    res.send(route)
})

export { router as indexRouteRouter }


// req.currentUser!.id