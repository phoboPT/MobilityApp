import request from 'supertest'
import { app } from '../../app'
import { Vehicle } from '../../models/vehicle'

jest.mock('../../nats-wrapper')
it('has a route handles listening to /api/vehicles post requests', async () => {
    const response = await request(app).post('/api/vehicles')
        .send({})

    expect(response.status).not.toEqual(404)
})

it('it can be only accessed if user is signed in', async () => {
    await request(app).post('/api/vehicles').send({}).expect(401)
})

it('return a status other than 401 if user is signed in', async () => {
    const response = await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({})

    expect(response.status).not.toEqual(401)
})

it('return an error if a invalid userId is provided', async () => {
    await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: '',
            type: 'asdf'
        })
        .expect(400)

    await request(app).post('/api/vehicles')
        .set('Cookie', global.signin()).send({
            type: 'fdsfsdf'
        }).expect(400)
})
it('return an error if a invalid type is provided', async () => {
    await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: 'dsf2354324',
            type: ''
        }).expect(400)

    await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: 'dsf2354324',
        }).expect(400)
})
it('creates a vehicle with valid inputs', async () => {
    let tickets = await Vehicle.find({})
    expect(tickets.length).toEqual(0)
    await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: 'dsf2354324',
            type: 'asdasf'
        }).expect(201)

    tickets = await Vehicle.find({})
    expect(tickets.length).toEqual(1)
    expect(tickets[0].type).toEqual('asdasf')
})