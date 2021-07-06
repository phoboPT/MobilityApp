import express, { Request, Response } from 'express';
import { requiredAuth } from '@mobileorg/common-lib';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders', requiredAuth, async (req: Request, res: Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id,
    }).populate('ticket');
    Order.collection.drop();
    res.send(orders);
});

export { router as indexOrderRouter };
