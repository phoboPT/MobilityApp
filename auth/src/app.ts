import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@mobileorg/common-lib';
import cookieSession from 'cookie-session';

const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
})
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)


app.all('*', async () => {
    throw new NotFoundError({ from: 'Index, /BAD_URL, route don\'t exist ' })
})

app.use(errorHandler)

export { app }