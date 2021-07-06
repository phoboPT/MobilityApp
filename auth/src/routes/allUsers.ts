import express from 'express';
import { User } from '../models/user';
const router = express.Router();

router.get('/api/users/allUsers', async (req, res) => {
    const user = await User.find({});
    res.send(user);
});

export { router as allUsersRouter };
