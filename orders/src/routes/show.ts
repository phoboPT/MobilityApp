import express, { Request, Response } from 'express';
import { requiredAuth, NotFoundError, NotAuthorizedError, currentUser, OrderStatus } from '@mobileorg/common-lib';
import { Order } from '../models/order';
import { Route } from '../models/route';

const router = express.Router();
router.get('/api/orders/userOrders', currentUser, requiredAuth, async (req: Request, res: Response) => {
    const orders = await Route.find({ userId: req.currentUser?.id, state: "AVAILABLE" });
    console.log(orders);
    
    if (!orders) {
        throw new NotFoundError({ details: 'notFound' });
    }
   
    

    res.send(orders);
});
router.get('/api/orders/routeId/:id', currentUser, requiredAuth, async (req: Request, res: Response) => {
    const order = await Order.find({ routeId: req.params.id, status: OrderStatus.Created }).populate('route');
    console.log(order);
    if (!order) {
        throw new NotFoundError({ details: 'notFound' });
    }

    res.send(order);
});
router.get('/api/orders/:orderId', requiredAuth, async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate('route');

    if (!order) {
        throw new NotFoundError({ details: 'notFound' });
    }
    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
    }

    res.send(order);
});

export { router as showOrderRouter };
