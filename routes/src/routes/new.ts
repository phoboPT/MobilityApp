import { requiredAuth, validateRequest } from "@mobileorg/common-lib"
import express, { Response, Request } from "express"
import { body } from 'express-validator'
import { RouteCreatedPublisher } from "../events/publishers/route-created-publisher"
import { Route } from "../models/route"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post('/api/routes', requiredAuth, [
    body('location').not().isEmpty().withMessage('location required'),
    body('type').not().isEmpty().withMessage('type required'),
    body('vehicleId').not().isEmpty().withMessage('vehicle required')
], validateRequest, async (req: Request, res: Response) => {
    const { location, type, vehicleId, state } = req.body

    const route = Route.build({
        location,
        type,
        userId: req.currentUser!.id,
        availableTime: "teste",
        vehiculeId: vehicleId,
        state: state || "unavailable"
    })
    await route.save()

    await new RouteCreatedPublisher(natsWrapper.client).publish({
        id: route.id,
        type: route.type,
        userId: route.userId,
        location: route.location,
        availableTime: route.availableTime,
        state: route.state
    })

    res.status(201).send(route)
})

export { router as createRouteRouter }