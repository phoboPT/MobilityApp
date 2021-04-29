import { requiredAuth, validateRequest } from "@mobileorg/common-lib"
import express, { Response, Request } from "express"
import { body } from 'express-validator'
import { Vehicle } from "../models/vehicle"

const router = express.Router()

router.post('/api/vehicles', requiredAuth, [
    body('location').not().isEmpty().withMessage('location required'),
    body('type').not().isEmpty().withMessage('type required')
], validateRequest, async (req: Request, res: Response) => {


    const { location, type } = req.body

    const vehicle = Vehicle.build({
        location,
        type,
        userId: req.currentUser!.id
    })
    await vehicle.save()
    res.status(201).send(vehicle)
})

export { router as createVehicleRouter }