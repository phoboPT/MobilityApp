import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { BadRequestError, validateRequest } from '@mobileorg/common-lib';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import { Password } from '../services/password';

const router = express.Router();

router.post(
    '/api/users/signin',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).notEmpty().withMessage('Provide a password'),
    ],

    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new BadRequestError('Bad credentials provided', { from: 'Signin, invalid credentials' });
        }
        const passwordsMatch = await Password.compare(existingUser.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError('Bad credentials provided', { from: 'Signin, invalid credentials' });
        }

        //Generate and setting token
        const userJwt = jwt.sign(
            {
                id: existingUser.id,
                email: existingUser.email,
                rating: existingUser.rating,
            },
            process.env.JWT_KEY!
        );

        req.session = { jwt: userJwt };
        res.status(200).send(existingUser);
    }
);

export { router as signinRouter };
