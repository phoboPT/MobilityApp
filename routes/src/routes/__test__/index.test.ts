import request from 'supertest';
import { app } from '../../app';

it('can fetch a list of vehicles', async () => {
    await request(app).get('/api/routes').send().expect(200);
});
