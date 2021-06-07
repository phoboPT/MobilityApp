import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if the vehicle is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/rides/${id}`)
        .send()
        .expect(404)
})

it('returns a vehicule if it is found', async () => {
    const location = "asdsadsad"
    const type = "asfdasf"
    const availableTime = "teste"
    const status = "Available"
    const response = await request(app).post('/api/rides')
        .set('Cookie', global.signin())
        .send({
            location,
            type, availableTime, status
        }).expect(201)

    const rideResponse = await request(app).get(`/api/rides/${response.body.id}`)
        .send()
        .expect(200)

    expect(rideResponse.body.location).toEqual(location)

})

it('returns 404 if the vehicle is not found', async () => {



})
it('returns 404 if the vehicle is not found', async () => {



})
it('returns 404 if the vehicle is not found', async () => {



})