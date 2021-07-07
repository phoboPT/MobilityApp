import { OrderCancelledPublisher } from './../events/publishers/order-cancelled-publisher';
import { natsWrapper } from './../nats-wrapper';

import { requiredAuth, validateRequest, NotFoundError, OrderStatus } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Route } from '../models/route';
import { OrderFinishPublisher } from '../events/publishers/order-finish-publisher';

const router = express.Router();

router.post(
    '/api/orders/cancelled',
    requiredAuth,
    [
        body('id')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Id must be valid'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id, status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundError({ details: 'New order ' });
        }
        // const isReserved = await ticket.isReserved();
        // if (isReserved) {
        //     throw new BadRequestError('Already reserved', { details: 'order a ride' });
        // }

        order.set({
            status: OrderStatus.Cancelled,
        });

        await order.save();

        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            route: {
                id: order.routeId,
            },
        });
        res.status(201).send(order);
    }
);

router.post(
    '/api/orders/accepted',
    requiredAuth,
    [
        body('id')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Id must be valid'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            throw new NotFoundError({ details: 'New order ' });
        }
        // const isReserved = await ticket.isReserved();
        // if (isReserved) {
        //     throw new BadRequestError('Already reserved', { details: 'order a ride' });
        // }

        order.set({
            status: OrderStatus.Accepted,
        });

        await order.save();

        // new OrderCancelledPublisher(natsWrapper.client).publish({
        //     id: order.id,
        //     ticket: {
        //         id: order.routeId,
        //     },
        // });
        res.status(201).send(order);
    }
);

router.post(
    '/api/orders/finish',
    requiredAuth,
    [
        body('id')
            .not()
            .isEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('Id must be valid'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { id } = req.body;

        const order = await Order.find({ routeId: id });
        console.log(order);
        if (!order) {
            throw new NotFoundError({ details: 'New order ' });
        }
        // const isReserved = await ticket.isReserved();
        // if (isReserved) {
        //     throw new BadRequestError('Already reserved', { details: 'order a ride' });
        // }

        order.forEach(async (item) => {
            item.set({ status: OrderStatus.Complete });
            new OrderFinishPublisher(natsWrapper.client).publish({
                id: item.id,
                route: {
                    id: item.routeId,
                },
            });
            await item.save();
        });

        res.status(201).send(order);
    }
);

export { router as updateOrderRouter };
