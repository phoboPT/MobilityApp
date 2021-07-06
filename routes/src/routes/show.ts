import { NotFoundError } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { Route } from '../models/route';
const moment = require('moment');

const today = moment().startOf('day');
const router = express.Router();
router.get('/api/routes/endLocation/:location', async (req: Request, res: Response) => {
    // $gte = greater than equals
    // Não listar rotas em que já tenha passado o dia
    const route = await Route.find({
        endLocation: req.params.location,
        state: 'Available',
        startDate: { $gte: moment() },
    });

    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    res.send(route);
});

router.get('/api/routes/startLocation/:location', async (req: Request, res: Response) => {
    const route = await Route.find({ startLocation: req.params.location, state: 'Available' });

    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    res.send(route);
});

router.get('/api/routes/:id', async (req: Request, res: Response) => {
    const route = await Route.findById(req.params.id);

    if (!route) {
        throw new NotFoundError({ from: 'show ride' });
    }
    res.send(route);
});

export { router as showRouteRouter };
