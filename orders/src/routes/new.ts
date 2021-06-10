import { requiredAuth, validateRequest } from '@mobileorg/common-lib';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/api/orders', requiredAuth, [
  body('routeId')
    .not().
    isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage("Id must be valid")
], validateRequest, async (req: Request, res: Response) => {


  res.send({});
});

export { router as newOrderRouter };