import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, currentUser } from '@mobileorg/common-lib';
import cookieSession from 'cookie-session';
import { indexOrderRouter } from './routes';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';
// import { Order } from './models/order';
import { updateOrderRouter } from './routes/update';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
// Order.collection.drop();
app.use(currentUser);
app.use(updateOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
  throw new NotFoundError({ from: "Index, /BAD_URL, route don't exist" });
});

app.use(errorHandler);

export { app };
