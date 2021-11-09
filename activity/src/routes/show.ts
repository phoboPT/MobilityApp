import { NotFoundError } from "@mobileorg/common-lib"
import express, { Request, Response } from "express"
import { Vehicle } from "../models/vehicle"



const router = express.Router()

router.get('/api/vehicles/:id', async (req: Request, res: Response) => {

    const vehicle = await Vehicle.findById(req.params.id)

    if (!vehicle) {
        throw new NotFoundError({ from: 'show vehicle ' })
    }
    res.send(vehicle)

})

export { router as showVehicleRouter }