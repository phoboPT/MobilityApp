import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns 404 if the vehicle is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app).get(`/api/vehicles/${id}`)
        .send()
        .expect(404)
})

it('returns a vehicule if it is found', async () => {
    const location = "asdsadsad"
    const type = "asfdasf"
    const response = await request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location,
            type
        }).expect(201)

    const vehicleResponse = await request(app).get(`/api/vehicles/${response.body.id}`)
        .send()
        .expect(200)

    expect(vehicleResponse.body.location).toEqual(location)

})

it('returns 404 if the vehicle is not found', async () => {



})
it('returns 404 if the vehicle is not found', async () => {



})
it('returns 404 if the vehicle is not found', async () => {



})