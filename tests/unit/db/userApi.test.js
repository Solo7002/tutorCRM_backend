const request = require('supertest');
const app = require('../../../src/app');
const { User } = require('../../../src/models/dbModels');

describe('User API Tests', () => {
  describe('POST /api/users', () => {
    test('should create a new user and return status 201', async () => {
      const newUser = {
        Username: 'testUser',
        Password: 'Password123!',
        Email: 'test@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('UserId');
      expect(response.body.Username).toBe('testUser');
      expect(response.body.Email).toBe('test@example.com');
    });

    test('should return 400 for duplicate email', async () => {
      await request(app)
        .post('/api/users')
        .send({
          Username: 'user1',
          Password: 'Password123!',
          Email: 'test@example.com',
          LastName: 'Doe',
          FirstName: 'John',
        });

      const duplicateUser = {
        Username: 'user2',
        Password: 'Password123!',
        Email: 'test@example.com',
        LastName: 'Smith',
        FirstName: 'Jane',
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error');
    });
  });

  describe('GET /api/users', () => {
    test('should return a list of users and status 200', async () => {
      await User.create({
        Username: 'user1',
        Password: 'Password123!',
        Email: 'user1@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      });
      await User.create({
        Username: 'user2',
        Password: 'Password123!',
        Email: 'user2@example.com',
        LastName: 'Smith',
        FirstName: 'Jane',
      });

      const response = await request(app)
        .get('/api/users');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should return a user by ID and status 200', async () => {
      const testUser = await User.create({
        Username: 'testUser',
        Password: 'Password123!',
        Email: 'test@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      });

      const response = await request(app)
        .get(`/api/users/${testUser.UserId}`);

      expect(response.status).toBe(200);
      expect(response.body.Username).toBe('testUser');
      expect(response.body.Email).toBe('test@example.com');
    });

    test('should return 404 if user not found', async () => {
      const response = await request(app)
        .get('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('GET /api/users/search', () => {
    test('should return matching users and status 200', async () => {
      await User.create({
        Username: 'johnDoe',
        Password: 'Password123!',
        Email: 'john@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      });
      await User.create({
        Username: 'janeSmith',
        Password: 'Password123!',
        Email: 'jane@example.com',
        LastName: 'Smith',
        FirstName: 'Jane',
      });

      const response = await request(app)
        .get('/api/users/search')
        .query({ username: 'john' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0].Username).toBe('johnDoe');
    });

    test('should return 404 if no users match the criteria', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ username: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No users found matching the criteria.');
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update a user and return status 200', async () => {
      const testUser = await User.create({
        Username: 'testUser',
        Password: 'Password123!',
        Email: 'test@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      });

      const updatedData = {
        LastName: 'UpdatedDoe',
        FirstName: 'UpdatedJohn',
      };

      const response = await request(app)
        .put(`/api/users/${testUser.UserId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.LastName).toBe('UpdatedDoe');
      expect(response.body.FirstName).toBe('UpdatedJohn');
    });

    test('should return 404 if user not found', async () => {
      const response = await request(app)
        .put('/api/users/999')
        .send({ LastName: 'UpdatedDoe', FirstName: 'UpdatedJohn' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    test('should delete a user and return status 200', async () => {
      const testUser = await User.create({
        Username: 'testUser',
        Password: 'Password123!',
        Email: 'test@example.com',
        LastName: 'Doe',
        FirstName: 'John',
      });

      const response = await request(app)
        .delete(`/api/users/${testUser.UserId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User deleted');

      const deletedUser = await User.findByPk(testUser.UserId);
      expect(deletedUser).toBeNull();
    });

    test('should return 404 if user not found', async () => {
      const response = await request(app)
        .delete('/api/users/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });
  });
});