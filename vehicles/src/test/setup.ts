import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
    namespace NodeJS {
        interface Global {
            signin(): string[];
        }
    }
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'gdhgdhgd';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    //build a JWT payload
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'teste@teste.com',
    };
    //create a JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    //build session Object
    const session = { jwt: token };
    //Return session into JSON
    const sessionJSON = JSON.stringify(session);
    //Take JSON and encode it
    const base64 = Buffer.from(sessionJSON).toString('base64');
    //return the string
    return [`express:sess=${base64}`];
};
