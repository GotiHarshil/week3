const request = require('supertest');
const app = require('../../server');
const User = require('../../src/models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Authentication - Logout', () => {
    let token;

    beforeAll(async () => {
        const hashedPassword = await bcrypt.hash('logoutpass123', 10);
        const user = await User.create({
            name: 'Logout User',
            username: 'logoutuser01',
            email: 'logoutuser01@example.com',
            passwordHash: hashedPassword
        });

        token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'testsecret', {
            expiresIn: '1h',
        });
    });

    it('should log out successfully with a valid token', async () => {
        const res = await request(app)
            .post('/api/auth/logout')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
        expect(res.body.success).toBe(true);
    });

    it('should still respond if no token is provided (current behavior)', async () => {
        const res = await request(app)
            .post('/api/auth/logout');

        // right now your backend returns 200, so test for that
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('success');
    });

    afterAll(async () => {
        await User.deleteOne({ email: 'logoutuser01@example.com' });
    });
});