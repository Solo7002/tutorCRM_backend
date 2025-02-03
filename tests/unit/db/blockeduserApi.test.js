const request = require('supertest');
const app = require('../../../src/app');
const { User, BlockedUser } = require('../../../src/models/dbModels');

describe('BlockedUser API Tests', () => {
  describe('POST /api/blockedusers', () => {
    test('should create a new blocked user and return status 201', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const newBlockedUser = {
        ReasonDescription: 'Test reason',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser.UserId
      };

      const response = await request(app)
        .post('/api/blockedusers')
        .send(newBlockedUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('BlockedId');
      expect(response.body.ReasonDescription).toBe('Test reason');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 400 for invalid input (missing ReasonDescription)', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const invalidBlockedUser = {
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser.UserId
      };

      const response = await request(app)
        .post('/api/blockedusers')
        .send(invalidBlockedUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: Reason description is required');
    });
  });

  describe('GET /api/blockedusers', () => {
    test('should return a list of blocked users and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });
      const testUser2 = await User.create({
        Username: `user2${Date.now()}`,
        Password: 'Password123!',
        Email: `user2${Date.now()}@example.com`,
        LastName: 'Smith',
        FirstName: 'Jane'
      });

      await BlockedUser.create({
        ReasonDescription: 'Reason 1',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser1.UserId
      });
      await BlockedUser.create({
        ReasonDescription: 'Reason 2',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser2.UserId
      });

      const response = await request(app)
        .get('/api/blockedusers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/blockedusers/:id', () => {
    test('should return a blocked user by ID and status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testBlockedUser = await BlockedUser.create({
        ReasonDescription: 'Test reason',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser.UserId
      });

      const response = await request(app)
        .get(`/api/blockedusers/${testBlockedUser.BlockedId}`);

      expect(response.status).toBe(200);
      expect(response.body.ReasonDescription).toBe('Test reason');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 404 if blocked user not found', async () => {
      const response = await request(app)
        .get('/api/blockedusers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('BlockedUser not found');
    });
  });

  describe('GET /api/blockedusers/search', () => {
    test('should return matching blocked users and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });
      const testUser2 = await User.create({
        Username: `user2${Date.now()}`,
        Password: 'Password123!',
        Email: `user2${Date.now()}@example.com`,
        LastName: 'Smith',
        FirstName: 'Jane'
      });

      await BlockedUser.create({
        ReasonDescription: 'Reason A',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser1.UserId
      });
      await BlockedUser.create({
        ReasonDescription: 'Reason B',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser2.UserId
      });

      const response = await request(app)
        .get('/api/blockedusers/search')
        .query({ reasonDescription: 'Reason' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('should return 404 if no blocked users match the criteria', async () => {
      const response = await request(app)
        .get('/api/blockedusers/search')
        .query({ reasonDescription: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No blocked users found matching the criteria.');
    });
  });

  describe('PUT /api/blockedusers/:id', () => {
    test('should update a blocked user and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testBlockedUser = await BlockedUser.create({
        ReasonDescription: 'Old reason',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser.UserId
      });

      const updatedData = {
        ReasonDescription: 'Updated reason',
        BanEndDate: new Date(Date.now() + 172800000)
      };

      const response = await request(app)
        .put(`/api/blockedusers/${testBlockedUser.BlockedId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.ReasonDescription).toBe('Updated reason');
    });

    test('should return 404 if blocked user not found', async () => {
      const response = await request(app)
        .put('/api/blockedusers/999')
        .send({ ReasonDescription: 'Updated reason' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('BlockedUser not found');
    });
  });

  describe('DELETE /api/blockedusers/:id', () => {
    test('should delete a blocked user and return status 204', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testBlockedUser = await BlockedUser.create({
        ReasonDescription: 'Test reason',
        BanStartDate: new Date(),
        BanEndDate: new Date(Date.now() + 86400000),
        UserId: testUser.UserId
      });

      const response = await request(app)
        .delete(`/api/blockedusers/${testBlockedUser.BlockedId}`);

      expect(response.status).toBe(204);

      const deletedBlockedUser = await BlockedUser.findByPk(testBlockedUser.BlockedId);
      expect(deletedBlockedUser).toBeNull();
    });

    test('should return 404 if blocked user not found', async () => {
      const response = await request(app)
        .delete('/api/blockedusers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('BlockedUser not found');
    });
  });
});