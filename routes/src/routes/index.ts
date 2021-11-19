import { requiredAuth } from '@mobileorg/common-lib';
import express, { Response, Request } from 'express';
import { forEachChild } from 'typescript';
import { Route } from '../models/route';

const router = express.Router();

router.get('/api/routes', async (req: Request, res: Response) => {
    const route = await Route.find({});
    res.status(200).send(route);
});

router.get('/api/routes/user', requiredAuth, async (req: Request, res: Response) => {
    const route = await Route.find({ userId: req.currentUser!.id });
    res.status(200).send(route);
});

router.get('/api/routes/user/:id', requiredAuth, async (req: Request, res: Response) => {
    const route = await Route.find({ userId: req.params.id });
    res.status(200).send(route);
});





export { router as indexRouteRouter };

// req.currentUser!.id
