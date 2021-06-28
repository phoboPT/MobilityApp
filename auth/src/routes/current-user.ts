import express from 'express'
import { currentUser } from '@mobileorg/common-lib';
import { User } from '../models/user';
const router = express.Router();

router.get('/api/users/currentUser', currentUser, (req, res) => {

    res.send({ currentUser: req.currentUser || null })
})

router.get('/api/users/:id', async (req, res) => {
    const{id}=req.params
   
    const user = await User.findById(id)

    res.send(user)
})
export { router as currentUserRouter }