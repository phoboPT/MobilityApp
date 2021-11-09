import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/vehicles/${id}`)
        .set('Cookie', global.signin())
        .send({
            location: 'aslkdfj',
            type: "dsad",
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/vehicles/${id}`)
        .send({
            location: 'aslkdfj',
            type: "dsad",
        })
        .expect(401);
});

it('returns a 401 if the user does not own the vehicles', async () => {

    const response = await request(app)
        .post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: 'aslkdfj',
            type: "dsad",
        });

    await request(app)
        .put(`/api/vehicles/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            location: 'aslfdsfsdfkdfj',
            type: "dsadff",
        })
        .expect(401);
});
it('returns a 400 if the user provides an invalid userId or type', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/vehicles')
        .set('Cookie', cookie)
        .send({
            location: 'asldkfj',
            type: "20",
        });

    await request(app)
        .put(`/api/vehicles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: '',
            type: "20",
        })
        .expect(400);

    await request(app)
        .put(`/api/vehicles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: 'alskdfjj',
            type: "",
        })
        .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/vehicles')
        .set('Cookie', cookie)
        .send({
            location: 'asldkfj',
            type: "20",
        });

    await request(app)
        .put(`/api/vehicles/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            location: 'new title',
            type: "100",
        })
        .expect(200);

    const vehicleResponse = await request(app)
        .get(`/api/vehicles/${response.body.id}`)
        .send();

    expect(vehicleResponse.body.location).toEqual('new title');
    expect(vehicleResponse.body.type).toEqual("100");
});