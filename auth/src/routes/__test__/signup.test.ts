import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successfull signup', async () =>
    request(app)
        .post('/api/users/signup')
        .send({
            email: 'teste@teste.com',
            password: 'asdf',
            name: 'teste',
        })
        .expect(201));

it('returns a 400 with an invalid email', async () =>
    request(app)
        .post('/api/users/signup')
        .send({
            email: 'testedasda',
            password: 'asdf',
        })
        .expect(400));

it('returns a 400 with an invalid password', async () =>
    request(app)
        .post('/api/users/signup')
        .send({
            email: 'testedasda',
            password: '',
        })
        .expect(400));

it('returns a 400 with empty fields', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'email@e,masd.pt',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'asddff',
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'teste@teste12.com',
            password: 'asdf',
            name: 'teste',
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'teste@teste12.com',
            password: 'asdf',
            name: 'teste',
        })
        .expect(400);
});

it('sets a cookie after a successfull signup', async () => {
    const cookie = await global.signin();
    expect(cookie).toBeDefined();
});
