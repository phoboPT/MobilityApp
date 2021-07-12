import express, { Request, Response } from 'express';
import { requiredAuth, NotFoundError, NotAuthorizedError, currentUser, OrderStatus } from '@mobileorg/common-lib';
import { Order } from '../models/order';


const router = express.Router();

router.get('/api/orders/routeId/:id', currentUser, requiredAuth, async (req: Request, res: Response) => {
        console.log("hey",req.params.id)
    const order = await Order.find({ routeId: req.params.id, status: OrderStatus.Created });
    console.log("order",order);
    if (!order) {
        throw new NotFoundError({ details: 'notFound' });
    }

    res.send(order);
});

router.get('/api/orders/userId', currentUser, requiredAuth, async (req: Request, res: Response) => {
        console.log("hey",req.params.id)
    const order = await Order.find({ userId: req.currentUser!.id});
    console.log("order",order);
    if (!order) {
        throw new NotFoundError({ details: 'notFound' });
    }

    res.send(order);
});

router.get('/api/orders/:orderId', requiredAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
        throw new NotFoundError({ details: 'notFound' });
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };
