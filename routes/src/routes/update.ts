import { requiredAuth, validateRequest, NotAuthorizedError, NotFoundError, currentUser } from '@mobileorg/common-lib';
import express, { Response, Request, request } from 'express';
import { body } from 'express-validator';
import { RouteUpdatedPublisher } from '../events/publishers/route-updated-publisher';
import { Route } from '../models/route';
//import { natsWrapper } from "../nats-wrapper"

const router = express.Router();

router.put('/api/routes/:id', currentUser, requiredAuth, validateRequest, async (req: Request, res: Response) => {
    const route = await Route.findById(req.params.id);
    console.log(route);
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
        availableTime,
        actualCapacity,
    } = req.body;
    if (!route) {
        throw new NotFoundError({ from: 'Route not found, verify the route id' });
    }

    // if (route.userId !== req.currentUser!.id) {
    //     throw new NotAuthorizedError();
    // }
    route.set({
        userId: req.currentUser!.id,
        type: type || route.type,
        startLocation: startLocation || route.startLocation,
        endLocation: endLocation || route.endLocation,
        availableTime: availableTime || route.availableTime,
        vehicleId: vehicleId || route.vehicleId,
        state: state || route.state,
        description: description || route.description,
        estimatedTime: estimatedTime || route.estimatedTime,
        startDate: startDate || route.startDate,
        userImage: userImage || route.userImage,
        rating: rating || route.rating,
        capacity: capacity || route.capacity,
        actualCapacity: actualCapacity || route.actualCapacity,
    });

    await route.save();
    console.log('hey');
    // new RouteUpdatedPublisher(natsWrapper.client).publish({
    //     id: route.id,
    //     type: route.type,
    //     userId: route.userId,
    //     startLocation: route.startLocation,
    //     endLocation: route.endLocation,
    //     availableTime: route.availableTime,
    //     vehicleId: route.vehicleId,
    //     state: route.state,
    //     description: route.description,
    //     estimatedTime: route.estimatedTime,
    //     startDate: route.startDate,
    //     userImage: route.userImage
    // })

    res.send(route);
});

export { router as updateRouteRouter };
