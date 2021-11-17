import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the route is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`/api/routes/${id}`).send().expect(404);
});

it('returns a vehicule if it is found', async () => {
     const location = 'ESS';
    // const type = 'asfdasf';
    // const availableTime = 'teste';
    // const status = 'Available';

    const cookie=global.signin()
    console.log(cookie)
    const response = await request(app)
        .post('/api/routes')
        .set('Cookie', cookie)
        .send({
            "startLocation":location,
            "type":2,
            "vehicleId":"60ed58dde9bf430019f5482e",
            "state":"AVAILABLE",
            "endLocation":"ESTG",
            "estimatedTime":"20 minutos",
            "description":"boa",
            "startDate":"Wed Nov 16 2021 17:05:14 GMT+0100 (Hora de verão da Europa Ocidental)",
            "capacity":15
        })
        .expect(201);
    console.log(response.body)
    const rideResponse = await request(app).get(`/api/routes/${response.body.id}`).send().expect(200);

    expect(rideResponse.body.startLocation).toEqual(location);
});

it('returns 404 if the vehicle is not found', async () => {});
it('returns 404 if the vehicle is not found', async () => {});
it('returns 404 if the vehicle is not found', async () => {});
