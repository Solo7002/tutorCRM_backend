const request = require('supertest');
const app = require('../../../src/app');
const { UserPhone } = require('../../../src/models/dbModels');

describe('UserPhone API Tests', () => {
  describe('POST /api/userphones', () => {
    test('should create a new user phone and return status 201', async () => {
      const newUserPhone = {
        PhoneNumber: '+1234567890',
        NickName: 'JohnDoe',
        SocialNetworkName: 'Telegram'
      };

      const response = await request(app)
        .post('/api/userphones')
        .send(newUserPhone);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('UserPhoneId');
      expect(response.body.PhoneNumber).toBe('+1234567890');
      expect(response.body.NickName).toBe('JohnDoe');
      expect(response.body.SocialNetworkName).toBe('Telegram');
    });

    test('should return 400 for invalid input (missing PhoneNumber)', async () => {
      const invalidUserPhone = {
        NickName: 'JohnDoe',
        SocialNetworkName: 'Telegram'
      };

      const response = await request(app)
        .post('/api/userphones')
        .send(invalidUserPhone);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: PhoneNumber cannot be empty');
    });
  });

  describe('GET /api/userphones', () => {
    test('should return a list of user phones and status 200', async () => {
      await UserPhone.create({
        PhoneNumber: '+0987654321',
        NickName: 'JaneDoe',
        SocialNetworkName: 'WhatsApp'
      });

      const response = await request(app)
        .get('/api/userphones');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/userphones/:id', () => {
    test('should return a user phone by ID and status 200', async () => {
      const userPhone = await UserPhone.create({
        PhoneNumber: '+1122334455',
        NickName: 'Alice',
        SocialNetworkName: 'Viber'
      });

      const response = await request(app)
        .get(`/api/userphones/${userPhone.UserPhoneId}`);

      expect(response.status).toBe(200);
      expect(response.body.PhoneNumber).toBe('+1122334455');
      expect(response.body.NickName).toBe('Alice');
      expect(response.body.SocialNetworkName).toBe('Viber');
    });

    test('should return 404 if user phone not found', async () => {
      const response = await request(app)
        .get('/api/userphones/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserPhone not found');
    });
  });

  describe('GET /api/userphones/search', () => {
    test('should return matching user phones and status 200', async () => {
      await UserPhone.create({
        PhoneNumber: '+1234567890',
        NickName: 'SearchableNick',
        SocialNetworkName: 'SearchableNetwork'
      });

      const response = await request(app)
        .get('/api/userphones/search')
        .query({ nickname: 'Searchable' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].NickName).toContain('Searchable');
    });

    test('should return 404 if no user phones match the criteria', async () => {
      const response = await request(app)
        .get('/api/userphones/search')
        .query({ nickname: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No user phones found matching the criteria.');
    });
  });

  describe('PUT /api/userphones/:id', () => {
    test('should update a user phone and return status 200', async () => {
      const userPhone = await UserPhone.create({
        PhoneNumber: '+1122334455',
        NickName: 'OldNick',
        SocialNetworkName: 'OldNetwork'
      });

      const updatedData = {
        NickName: 'UpdatedNick',
        SocialNetworkName: 'UpdatedNetwork'
      };

      const response = await request(app)
        .put(`/api/userphones/${userPhone.UserPhoneId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.NickName).toBe('UpdatedNick');
      expect(response.body.SocialNetworkName).toBe('UpdatedNetwork');
    });

    test('should return 404 if user phone not found', async () => {
      const response = await request(app)
        .put('/api/userphones/999')
        .send({ NickName: 'UpdatedNick' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserPhone not found');
    });
  });

  describe('DELETE /api/userphones/:id', () => {
    test('should delete a user phone and return status 204', async () => {
      const userPhone = await UserPhone.create({
        PhoneNumber: '+9999999999',
        NickName: 'ToDelete',
        SocialNetworkName: 'DeleteNetwork'
      });

      const response = await request(app)
        .delete(`/api/userphones/${userPhone.UserPhoneId}`);

      expect(response.status).toBe(204);

      const deletedUserPhone = await UserPhone.findByPk(userPhone.UserPhoneId);
      expect(deletedUserPhone).toBeNull();
    });

    test('should return 404 if user phone not found', async () => {
      const response = await request(app)
        .delete('/api/userphones/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserPhone not found');
    });
  });
});