import { natsWrapper } from './../nats-wrapper';
import { OrderCreatedPublisher } from './../events/publishers/order-created-publisher';
import { requiredAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError,currentUser } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Route } from '../models/route';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 15 * 60;
router.post(
    '/api/orders',
    requiredAuth,
    [
        body('routeId')
            .not()

            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Id must be valid'),
    ],
    currentUser,
    validateRequest,
    async (req: Request, res: Response) => {
        const { routeId } = req.body;

        let route = await Route.findById(routeId);
        if (!route) {
            throw new NotFoundError({ details: 'New order ' });
            // route = Route.build({ id: routeId });
        }
        // const isReserved = await ticket.isReserved();
        // if (isReserved) {
        //     throw new BadRequestError('Already reserved', { details: 'order a ride' });
        // }
        const userOrder=await Order.find({userId:req.currentUser?.id,routeId:routeId})
        console.log(userOrder)
        if(userOrder.length>0){
            throw new BadRequestError('Already ordered', { details: 'order a ride' });
        }
        const expiration = new Date();

        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            route: route,
            routeId,
        });

        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            version: order.version,
            route: {
                id: route.id,
            },
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            routeId: order.routeId,
        });
        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
