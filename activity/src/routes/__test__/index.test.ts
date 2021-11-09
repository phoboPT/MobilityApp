
import request from 'supertest'
import { app } from '../../app'

const createVehicle = () => {
    return request(app).post('/api/vehicles')
        .set('Cookie', global.signin())
        .send({
            location: "asdsadsad",
            type: "asfdasf"
        }).expect(201)
}

it('can fetch a list of vehicles', async () => {
    await createVehicle()
    await createVehicle()
    await createVehicle()

    const response = await request(app)
        .get('/api/vehicles')
        .send()
        .expect(200)

    expect(response.body.length).toEqual(3)
})