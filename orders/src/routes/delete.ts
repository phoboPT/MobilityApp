import express, { Request, Response } from 'express';
import { requiredAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@mobileorg/common-lib';
import { Order } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requiredAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('route');

    if (!order) {
        throw new NotFoundError({ details: 'error' });
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }
    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        route: {
            id: order.route.id,
        },
    });

    res.status(204).send(order);
});

export { router as deleteOrderRouter };
