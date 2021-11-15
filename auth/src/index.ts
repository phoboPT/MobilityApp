import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI not defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID not defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID not defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL not defined');
    }

    try {
        console.log('orders', process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        });
        natsWrapper.client.on('connect', () => {
            console.log('NATS connection started');
        });
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });

        console.log('Connected to mongo DB');
    } catch (err) {
        console.error(`Error on auth index ${err}`);
    }
    app.listen(3000, () => {
        console.log('Listening port 3000!!!!!!!!');
    });
};

start();
