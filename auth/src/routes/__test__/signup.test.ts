import request from 'supertest'
import { app } from '../../app'

it('returns a 201 on successfull signup', async () => {
    return request(app).post('/api/users/signup').send({
        email: "teste@teste.com",
        password: 'asdf'
    }).expect(201)
})

it('returns a 400 with an invalid email', async () => {
    return request(app).post('/api/users/signup').send({
        email: "testedasda",
        password: 'asdf'
    }).expect(400)
})

it('returns a 400 with an invalid password', async () => {
    return request(app).post('/api/users/signup').send({
        email: "testedasda",
        password: ''
    }).expect(400)
})

it('returns a 400 with empty fields', async () => {
    await request(app).post('/api/users/signup').send({
        email: "email@e,masd.pt"
    }).expect(400)

    await request(app).post('/api/users/signup').send({
        password: "asddff"
    }).expect(400)
})

it('disallows duplicate emails', async () => {
    await request(app).post('/api/users/signup').send({
        email: "teste@teste.com",
        password: 'asdf'
    }).expect(201)
    await request(app).post('/api/users/signup').send({
        email: "teste@teste.com",
        password: 'asdf'
    }).expect(400)
})

it('sets a cookie after a successfull signup', async () => {
    const response = await request(app).post('/api/users/signup').send({
        email: "teste@teste.com",
        password: 'asdf'
    }).expect(201)
    expect(response.get('Set-Cookie')).toBeDefined()

})