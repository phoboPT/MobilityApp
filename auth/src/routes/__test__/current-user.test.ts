import request from 'supertest';
import { app } from '../../app';

it('respondes with details about the current user', async () => {
    const cookie = await global.signin();

    const response = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send().expect(200);

    expect(response.body.email).toEqual('teste@teste.com');
});

it('respondes with null if not autehnticated', async () => {
    const response = await request(app).get('/api/users/currentuser').send().expect(200);
    expect(response.body.currentUser).toEqual(undefined);
});
