import express, { Response, Request } from "express"
import { Route } from "../models/route"

const router = express.Router()

router.get('/api/routes', async (req: Request, res: Response) => {
    const route = await Route.find({})
    res.send(route)
})

export { router as indexRouteRouter }