import request from 'supertest';
import { app } from '../../app';
import { Route } from '../../models/route';

it('has a route handles listening to /api/routes post requests', async () => {
    const response = await request(app).post('/api/routes').send({});

    expect(response.status).not.toEqual(404);
});

it('it can be only accessed if user is signed in', async () => {
    await request(app).post('/api/routes').send({}).expect(401);
});

it('return a status other than 401 if user is signed in', async () => {
    const response = await request(app).post('/api/routes').set('Cookie', global.signin()).send({});

    expect(response.status).not.toEqual(401);
});

it('return an error if a invalid userId is provided', async () => {
    await request(app)
        .post('/api/routes')
        .set('Cookie', global.signin())
        .send({
            location: '',
            type: 'asdf',
        })
        .expect(400);

    await request(app)
        .post('/api/routes')
        .set('Cookie', global.signin())
        .send({
            type: 'fdsfsdf',
        })
        .expect(400);
});
it('return an error if a invalid type is provided', async () => {
    await request(app)
        .post('/api/routes')
        .set('Cookie', global.signin())
        .send({
            location: 'dsf2354324',
            type: '',
        })
        .expect(400);

    await request(app)
        .post('/api/routes')
        .set('Cookie', global.signin())
        .send({
            location: 'dsf2354324',
        })
        .expect(400);
});
it('creates a ride with valid inputs', async () => {
    let tickets = await Route.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
        .post('/api/routes')
        .set('Cookie', global.signin())
        .send({
            "startLocation":"ESS",
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

    tickets = await Route.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].type).toEqual('ESS');
});
