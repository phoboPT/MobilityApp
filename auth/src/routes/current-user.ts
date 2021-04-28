import express from 'express'

const router = express.Router();

router.get('/api/users/currentUser', (req, res) => {


    res.send('hi there baby girl!')
})


export { router as currentUserRouter }