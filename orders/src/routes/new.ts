import { natsWrapper } from './../nats-wrapper';
import { OrderCreatedPublisher } from './../events/publishers/order-created-publisher';
import { requiredAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import { Ticket } from '../models/ticket';

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
    validateRequest,
    async (req: Request, res: Response) => {
        const { ticketId } = req.body;

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new NotFoundError({ details: 'New order ' });
        }
        const isReserved = await ticket.isReserved();
        if (isReserved) {
            throw new BadRequestError('Already reserved', { details: 'order a ride' });
        }
        const expiration = new Date();

        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
        });

        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            status: order.status,
            ticket: {
                id: ticket.id,
            },
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
        });
        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
