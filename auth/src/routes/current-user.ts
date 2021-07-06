import { NotFoundError } from '@mobileorg/common-lib';
import express from 'express';
import { currentUser } from '@mobileorg/common-lib';
import { User } from '../models/user';
const router = express.Router();

router.get('/api/users/currentUser', currentUser, async (req, res) => {
    const user = await User.findById(req.currentUser?.id);

    res.send(user);
});

router.post('/api/users/edit', async (req, res) => {
    const { photoUrl, id, biography, contact, name } = req.body;
    const user = await User.findById(id);

    if (!user) {
        throw new NotFoundError({ from: 'User not found, verify the user id' });
    }

    user.set({
        photoUrl: photoUrl || user.photoUrl || '',
        biography: biography || user.briography || '',
        contact: contact || user.contact || '',
        name: name || user.name,
    });

    await user.save();
    res.send(user);
});

router.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);

    res.send(user);
});
export { router as currentUserRouter };
