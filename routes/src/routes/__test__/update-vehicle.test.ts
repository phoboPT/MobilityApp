import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/rides/${id}`)
        .set('Cookie', global.signin())
        .send({
            location: 'aslkdfj',
            type: "dsad",
            availableTime: "teste",
            status: "available"
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/rides/${id}`)
        .send({
            location: 'aslkdfj',
            type: "dsad",
            availableTime: "teste",
            status: "available"
        })
        .expect(401);
});

it('returns a 401 if the user does not own the rides', async () => {

    const response = await request(app)
        .post('/api/rides')
        .set('Cookie', global.signin())
        .send({
            location: 'aslkdfj',
            type: "dsad",
            availableTime: "teste",
            status: "available"
        });

    await request(app)
        .put(`/api/rides/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            location: 'aslfdsfsdfkdfj',
            type: "dsadff",
            availableTime: "teste",
            status: "available"
        })
        .expect(401);
});
it('returns a 400 if the user provides an invalid userId or type', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/rides')
        .set('Cookie', cookie)
        .send({
            location: 'asldkfj',
            type: "20",
            availableTime: "teste",
            status: "available"
        });

    await request(app)
        .put(`/api/rides/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: '',
            type: "20",
            availableTime: "teste",
            status: "available"
        })
        .expect(400);

    await request(app)
        .put(`/api/rides/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: 'alskdfjj',
            type: "",
            availableTime: "teste",
            status: "available"
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/rides')
        .set('Cookie', cookie)
        .send({
            location: 'asldkfj',
            type: "20",
            availableTime: "teste",
            status: "available"
        });

    await request(app)
        .put(`/api/rides/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: 'new title',
            type: "100",
            availableTime: "teste",
            status: "available"
        })
        .expect(200);

    const rideResponse = await request(app)
        .get(`/api/rides/${response.body.id}`)
        .send();

    expect(rideResponse.body.location).toEqual('new title');
    expect(rideResponse.body.type).toEqual("100");
});