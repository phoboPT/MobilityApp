import express from 'express'
import { currentUser } from '@mobileorg/common-lib';
import { User } from '../models/user';
const router = express.Router();

router.get('/api/users/currentUser', currentUser,async (req, res) => {

    const user = await User.findById(req.currentUser?.id)

    res.send(user)
})

router.get('/api/users/:id', async (req, res) => {
    const{id}=req.params
   
    const user = await User.findById(id)

    res.send(user)
})
export { router as currentUserRouter }