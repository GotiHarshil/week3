const request = require('supertest');
const app = require('../../server');
const User = require('../../src/models/User');

describe('Auth Routes', () => {

    test('POST /signup should create a new user', async () => {
        const newUser = {
            name: 'Alex Adams',
            username: 'alexadams11',
            email: 'alexadams@example.com',
            password: 'password123'
        };
        const response = await request(app)
            .post('/api/auth/signup')
            .send(newUser);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.name).toBe('Alex Adams');
        expect(response.body.username).toBe('alexadams11');
        expect(response.body.email).toBe('alexadams@example.com');
        expect(response.body).not.toHaveProperty('passwordHash');
    },);

    afterEach(async () => {
        await User.deleteOne({ username: 'alexadams11', email: 'alexadams@example.com' });
    });
});