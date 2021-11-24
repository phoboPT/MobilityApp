import { currentUser, NotFoundError } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { Route } from '../models/route';

const router = express.Router();
router.get('/api/routes/endLocation/:location', currentUser, async (req: Request, res: Response) => {
    // $gte = greater than equals
    // Não listar rotas em que já tenha passado o dia nem que seja do utilizador
    const route = await Route.find({
        endLocation: req.params.location,
        state: 'AVAILABLE',
    }).sort({ startDate: 1 });
    console.log(route);
    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    const final: any = [];
    route.forEach((item) => {
        if (new Date(item.startDate) > new Date() && item.userId !== req.currentUser!.id) {
            final.push(item);
        }
    });

    res.send(final);
});

router.get('/api/routes/startLocation/:location', async (req: Request, res: Response) => {
    const route = await Route.find({
        startLocation: req.params.location,
        state: 'AVAILABLE',
    }).sort({ startDate: 1 });
    console.log(route, req.params.location);
    const final: any = [];
    route.forEach((item) => {
        if (new Date(item.startDate) > new Date() && item.userId !== req.currentUser!.id) {
            final.push(item);
        }
    });
    if (!final) {
        throw new NotFoundError({ from: 'show ride' });
    }

    res.send(route);
});

router.get('/api/routes/user', currentUser, async (req: Request, res: Response) => {
    const route = await Route.find({ userId: req.currentUser!.id });
    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    res.send(route);
});

router.get('/api/routes/:id', async (req: Request, res: Response) => {
    console.log(req.params.id);
    const route = await Route.findById(req.params.id);

    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    res.send(route);
});

export { router as showRouteRouter };
