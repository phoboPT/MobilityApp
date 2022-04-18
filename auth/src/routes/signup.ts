import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@mobileorg/common-lib';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
    body('name').trim().isLength({ min: 4, max: 20 }).withMessage('Name must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, name, photoUrl, biography, contact, birthDate } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use', {
        from: 'Signup, email is already in use',
      });
    }

    const user = User.build({
      email,
      password,
      rating: 0,
      name: name || '',
      photoUrl:
        photoUrl ||
        'https://toppng.com/uploads/preview/app-icon-set-login-icon-comments-avatar-icon-11553436380yill0nchdm.png',
      biography: biography || '',
      contact: contact || '',
      birthDate: birthDate || '',
    });
    await user.save();
    //Generate and setting token
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY || 'MySeCrEt'
    );

    req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
