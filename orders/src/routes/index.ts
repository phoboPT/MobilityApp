import express, { Request, Response } from 'express';
import { requiredAuth, currentUser } from '@mobileorg/common-lib';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', currentUser, requiredAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('route');
    // Order.collection.drop();
    res.send(orders);
});

export { router as indexOrderRouter };
