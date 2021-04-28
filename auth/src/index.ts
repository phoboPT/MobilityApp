import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middleware/error-handler';
import { NotFoundError } from './errors/not-found-error';
import cookieSession from 'cookie-session';

const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: true,
})
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all('*', async () => {
    throw new NotFoundError()
})

app.use(errorHandler)
const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined')
    }

    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
        console.log('Connected to mongo DB')

    } catch (err) {
        console.error(`Error on start ${err}`)
    }
    app.listen(3000, () => {
        console.log('Listening port 3000!!!!!!!!')
    })
}

start()

