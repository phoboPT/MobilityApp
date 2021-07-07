import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@mobileorg/common-lib';
import cookieSession from 'cookie-session';
import { createRouteRouter } from './routes/new';
import { showRouteRouter } from './routes/show';
import { indexRouteRouter } from './routes';
import { updateRouteRouter } from './routes/update';
import { searchRouteRouter } from './routes/search';
import { Route } from './models/route';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false,
    })
);
app.use(currentUser);
app.use(searchRouteRouter);
app.use(indexRouteRouter);
app.use(createRouteRouter);
app.use(showRouteRouter);
app.use(updateRouteRouter);
// Route.collection.drop();
app.all('*', async () => {
    throw new NotFoundError({ from: "Index, /BAD_URL, route don't exist" });
});

app.use(errorHandler);

export { app };
