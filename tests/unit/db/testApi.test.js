const request = require('supertest');
const app = require('../../../src/app');
const { Test } = require('../../../src/models/dbModels');

describe('Test API Tests', () => {
  describe('POST /api/tests', () => {
    test('should create a new test and return status 201', async () => {
      const newTest = {
        TestName: 'Math Test',
        TestDescription: 'This is a math test.',
        CreatedDate: new Date()
      };

      const response = await request(app)
        .post('/api/tests')
        .send(newTest);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('TestId');
      expect(response.body.TestName).toBe('Math Test');
      expect(response.body.TestDescription).toBe('This is a math test.');
      expect(new Date(response.body.CreatedDate)).toBeInstanceOf(Date);
    });

    test('should return 400 for invalid input (missing TestName)', async () => {
      const invalidTest = {
        TestDescription: 'This is a math test.',
        CreatedDate: new Date()
      };

      const response = await request(app)
        .post('/api/tests')
        .send(invalidTest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: TestName cannot be empty');
    });
  });

  describe('GET /api/tests', () => {
    test('should return a list of tests and status 200', async () => {
      await Test.create({
        TestName: 'Science Test',
        TestDescription: 'This is a science test.',
        CreatedDate: new Date()
      });

      const response = await request(app)
        .get('/api/tests');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/tests/:id', () => {
    test('should return a test by ID and status 200', async () => {
      const test = await Test.create({
        TestName: 'Chemistry Test',
        TestDescription: 'This is a chemistry test.',
        CreatedDate: new Date()
      });

      const response = await request(app)
        .get(`/api/tests/${test.TestId}`);

      expect(response.status).toBe(200);
      expect(response.body.TestName).toBe('Chemistry Test');
      expect(response.body.TestDescription).toBe('This is a chemistry test.');
      expect(new Date(response.body.CreatedDate)).toBeInstanceOf(Date);
    });

    test('should return 404 if test not found', async () => {
      const response = await request(app)
        .get('/api/tests/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Test not found');
    });
  });

  describe('GET /api/tests/search', () => {
    test('should return matching tests and status 200', async () => {
      await Test.create({
        TestName: 'Biology Test',
        TestDescription: 'This is a biology test.',
        CreatedDate: new Date()
      });

      const response = await request(app)
        .get('/api/tests/search')
        .query({ testName: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].TestName).toContain('Biology');
    });

    test('should return 404 if no tests match the criteria', async () => {
      const response = await request(app)
        .get('/api/tests/search')
        .query({ testName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No tests found matching the criteria.');
    });
  });

  describe('PUT /api/tests/:id', () => {
    test('should update a test and return status 200', async () => {
      const test = await Test.create({
        TestName: 'History Test',
        TestDescription: 'This is a history test.',
        CreatedDate: new Date()
      });

      const updatedData = {
        TestName: 'Updated History Test'
      };

      const response = await request(app)
        .put(`/api/tests/${test.TestId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.TestName).toBe('Updated History Test');
    });

    test('should return 404 if test not found', async () => {
      const response = await request(app)
        .put('/api/tests/999')
        .send({ TestName: 'Updated Test' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Test not found');
    });
  });

  describe('DELETE /api/tests/:id', () => {
    test('should delete a test and return status 204', async () => {
      const test = await Test.create({
        TestName: 'Geography Test',
        TestDescription: 'This is a geography test.',
        CreatedDate: new Date()
      });

      const response = await request(app)
        .delete(`/api/tests/${test.TestId}`);

      expect(response.status).toBe(204);

      const deletedTest = await Test.findByPk(test.TestId);
      expect(deletedTest).toBeNull();
    });

    test('should return 404 if test not found', async () => {
      const response = await request(app)
        .delete('/api/tests/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Test not found');
    });
  });
});