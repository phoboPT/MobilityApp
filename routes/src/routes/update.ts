import { requiredAuth, validateRequest, NotAuthorizedError, NotFoundError } from "@mobileorg/common-lib"
import express, { Response, Request, request } from "express"
import { body } from "express-validator"
import { RouteUpdatedPublisher } from "../events/publishers/route-updated-publisher"
import { Route } from "../models/route"
import { natsWrapper } from "../nats-wrapper"


const router = express.Router()


router.put('/api/routes/:id', requiredAuth,
    [
        body('location').not().isEmpty().withMessage('location is required'),
        body('type').not().isEmpty().withMessage('type is required')
    ],
    validateRequest, async (req: Request, res: Response) => {
        const route = await Route.findById(req.params.id)
        if (!route) {
            throw new NotFoundError({ from: "Update vehicle" })
        }

        if (route.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }
        route.set({
            location: req.body.location,
            type: req.body.type,
        });
        await route.save();
        new RouteUpdatedPublisher(natsWrapper.client).publish({
            id: route.id,
            location: route.location,
            type: route.type,
            userId: route.userId,
            availableTime: route.availableTime,
            state: route.state
        })

        res.send(route)
    })

export { router as updateRouteRouter }