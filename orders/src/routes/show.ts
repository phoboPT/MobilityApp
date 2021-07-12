import express, { Request, Response } from 'express';
import { requiredAuth, NotFoundError, NotAuthorizedError, currentUser, OrderStatus } from '@mobileorg/common-lib';
import { Order,OrderDoc } from '../models/order';
import { Route } from '../models/route';

const router = express.Router();
router.get('/api/orders/userOrders', currentUser, requiredAuth, async (req: Request, res: Response) => {
    const routes = await Route.find({ userId: req.currentUser?.id, state: "AVAILABLE" });
    console.log(routes);
    
    if (!routes) {
        throw new NotFoundError({ details: 'notFound' });
    }
   const orders:any=[]
   //find all orders for the current user in the routes
   //{userId:"dasd",routeId:"asdasd",status:"AVAILABLE"}
   //for each order, fetch the oeder for the userId

    routes.forEach(async  (route):Promise<void> => {
        const order = await Order.find({ userId: route.userId }); 
        orders.push(order);
    });

    res.send(orders);
});
router.get('/api/orders/routeId/:id', async (req: Request, res: Response) => {
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
