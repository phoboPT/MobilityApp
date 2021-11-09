import { requiredAuth, validateRequest } from "@mobileorg/common-lib"
import express, { Response, Request } from "express"
import { body } from 'express-validator'
import { VehiculeCreatedPublisher } from "../events/publishers/vehicule-created-publisher"
import { Vehicle } from "../models/vehicle"
import { natsWrapper } from "../nats-wrapper"

const router = express.Router()

router.post('/api/vehicles', requiredAuth, [
    body('location').not().isEmpty().withMessage('location required'),
    body('type').not().isEmpty().withMessage('type required')
], validateRequest, async (req: Request, res: Response) => {
    const { location, type } = req.body

    const vehicule = Vehicle.build({
        location,
        type,
        userId: req.currentUser!.id
    })
    await vehicule.save()

    await new VehiculeCreatedPublisher(natsWrapper.client).publish({
        id: vehicule.id,
        type: vehicule.type,
        userId: vehicule.userId,
        location: vehicule.location
    })

    res.status(201).send(vehicule)
})

export { router as createVehicleRouter }