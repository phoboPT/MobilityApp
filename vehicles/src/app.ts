import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import { errorHandler, NotFoundError, currentUser } from '@mobileorg/common-lib';
import cookieSession from 'cookie-session';
import { createVehicleRouter } from './routes/new';
import { showVehicleRouter } from './routes/show';
import { indexVehicleRouter } from './routes';
import { updateVehicleRouter } from './routes/update';

const app = express()
app.set('trust proxy', true)
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
})
)

app.use(currentUser)
app.use(createVehicleRouter)
app.use(showVehicleRouter)
app.use(indexVehicleRouter)
app.use(updateVehicleRouter)

app.all('*', async () => {
    console.log("object")
    throw new NotFoundError({ from: 'Index, /BAD_URL, route don\'t exist sadasdasd' })
})

app.use(errorHandler)

export { app }