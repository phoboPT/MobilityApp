import { OrderUpdatedListener } from './events/listeners/order-update-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderFinishedListener } from './events/listeners/order-finished-listener';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not defined');
  }

  try {
    await natsWrapper.connect('orders', process.env.NATS_CLIENT_ID, process.env.NATS_URL);
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());
    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderUpdatedListener(natsWrapper.client).listen();
    new OrderFinishedListener(natsWrapper.client).listen();
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Connected to mongo DB');
  } catch (err) {
    console.error(`Error on start ${err}`);
  }
  app.listen(3000, () => {
    console.log('Listening port 3000!!!!!!!!');
  });
};

start();
