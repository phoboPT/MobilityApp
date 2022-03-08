import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@mobileorg/common-lib';
import cookieSession from 'cookie-session';
import { createVehicleRouter } from './routes/new';
import { showVehicleRouter } from './routes/show';
import { indexVehicleRouter } from './routes';
import { updateVehicleRouter } from './routes/update';
import { Vehicle } from './models/vehicle';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);

// Vehiclee.collection.drop();
app.use(currentUser);
app.use(createVehicleRouter);
app.use(showVehicleRouter);
app.use(indexVehicleRouter);
app.use(updateVehicleRouter);

app.all('*', async () => {
  throw new NotFoundError({ from: "Index, /BAD_URL, route don't exist" });
});

app.use(errorHandler);

export { app };
