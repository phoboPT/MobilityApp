import request from 'supertest';
import { app } from '../../app';

it('fails when a email does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'teste@teste.com',
            password: 'asdf',
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'teste@teste.com',
            password: 'asdf',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'teste@teste.com',
            password: 'fdsfsdf',
        })
        .expect(400);
});

it('respondes with a cookie with valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'teste@teste.com',
            password: 'asdf',
            name: 'easdasfsda',
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'teste@teste.com',
            password: 'asdf',
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});
