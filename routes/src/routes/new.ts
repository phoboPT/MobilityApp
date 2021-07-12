import { requiredAuth, validateRequest } from '@mobileorg/common-lib';
import express, { Response, Request } from 'express';
import { body } from 'express-validator';
import { RouteCreatedPublisher } from '../events/publishers/route-created-publisher';
import { Route } from '../models/route';
import { natsWrapper } from '../nats-wrapper';//import { natsWrapper } from "../nats-wrapper"

const router = express.Router();

router.post(
    '/api/routes',
    requiredAuth,
    [
        body('startLocation').not().isEmpty().withMessage('start location required'),
        body('type').not().isEmpty().withMessage('type required'),
        body('vehicleId').not().isEmpty().withMessage('vehicle required'),
        body('startLocation').not().isEmpty().withMessage('starting point is required'),
        body('endLocation').not().isEmpty().withMessage('end point is required'),
        body('description').not().isEmpty().withMessage('description is required'),
        body('startDate').not().isEmpty().withMessage('starting date is required'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {
            startLocation,
            type,
            vehicleId,
            state,
            endLocation,
            estimatedTime,
            userImage,
            description,
            startDate,
            rating,
            capacity,
        } = req.body;

        const route = Route.build({
            userId: req.currentUser!.id,
            type,
            startLocation,
            endLocation,
            availableTime: 'teste',
            vehicleId,
            state: state || 'unavailable',
            description,
            estimatedTime,
            startDate,
            userImage: userImage || '',
            rating: rating || 0,
            capacity: capacity || 0,
            actualCapacity: capacity || 0,
        });
        await route.save();

        await new RouteCreatedPublisher(natsWrapper.client).publish({
            id: route.id,
            type: route.type,
            userId: route.userId,
            startLocation: route.startLocation,
            endLocation: route.endLocation,
            availableTime: route.availableTime,
            vehicleId: route.vehicleId,
            state: route.state,
            description: route.description,
            estimatedTime: route.estimatedTime,
            startDate: route.startDate,
            userImage: route.userImage,
            capacity: route.capacity,
            actualCapacity: route.actualCapacity,
        });

        res.status(201).send(route);
    }
);

export { router as createRouteRouter };
