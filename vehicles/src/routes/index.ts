import express, { Response, Request } from 'express';
import { Vehicle } from '../models/vehicle';

const router = express.Router();

router.get('/api/vehicles', async (req: Request, res: Response) => {
    const vehicles = await Vehicle.find({});

    res.send(vehicles);
});

export { router as indexVehicleRouter };
