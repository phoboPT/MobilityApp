import { requiredAuth, validateRequest } from '@mobileorg/common-lib';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { VehiculeCreatedPublisher } from '../events/publishers/vehicule-created-publisher';
import { Vehicle } from '../models/vehicle';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/vehicles',
    requiredAuth,
    [body('type').not().isEmpty().withMessage('type required')],
    validateRequest,
    async (req: Request, res: Response) => {
        const { type, carModel, capacity } = req.body;
        console.log(carModel);
        const vehicle = Vehicle.build({
            type: type,
            userId: req.currentUser!.id,
            carModel: carModel,
            capacity: capacity,
        });
        await vehicle.save();

        // await new VehiculeCreatedPublisher(natsWrapper.client).publish({
        //     id: vehicule.id,
        //     type: vehicule.type,
        //     userId: vehicule.userId,

        // })

        res.status(201).send(vehicle);
    }
);

export { router as createVehicleRouter };
