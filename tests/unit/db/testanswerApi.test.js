const request = require('supertest');
const app = require('../../../src/app');
const { TestAnswer } = require('../../../src/models/dbModels');

describe('TestAnswer API Tests', () => {
  describe('POST /api/testanswers', () => {
    test('should create a new test answer and return status 201', async () => {
      const newTestAnswer = {
        AnswerText: 'Correct Answer',
        ImagePath: 'http://example.com/images/answer.png',
        IsRightAnswer: true
      };

      const response = await request(app)
        .post('/api/testanswers')
        .send(newTestAnswer);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('TestAnswerId');
      expect(response.body.AnswerText).toBe('Correct Answer');
      expect(response.body.ImagePath).toBe('http://example.com/images/answer.png');
      expect(response.body.IsRightAnswer).toBe(true);
    });

    test('should return 400 for invalid input (missing AnswerText)', async () => {
      const invalidTestAnswer = {
        ImagePath: 'http://example.com/images/answer.png',
        IsRightAnswer: true
      };

      const response = await request(app)
        .post('/api/testanswers')
        .send(invalidTestAnswer);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: AnswerText cannot be empty');
    });
  });

  describe('GET /api/testanswers', () => {
    test('should return a list of test answers and status 200', async () => {
      await TestAnswer.create({
        AnswerText: 'Sample Answer',
        ImagePath: 'http://example.com/images/sample.png',
        IsRightAnswer: false
      });

      const response = await request(app)
        .get('/api/testanswers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/testanswers/:id', () => {
    test('should return a test answer by ID and status 200', async () => {
      const testAnswer = await TestAnswer.create({
        AnswerText: 'Test Answer',
        ImagePath: 'http://example.com/images/test.png',
        IsRightAnswer: true
      });

      const response = await request(app)
        .get(`/api/testanswers/${testAnswer.TestAnswerId}`);

      expect(response.status).toBe(200);
      expect(response.body.AnswerText).toBe('Test Answer');
      expect(response.body.ImagePath).toBe('http://example.com/images/test.png');
      expect(response.body.IsRightAnswer).toBe(true);
    });

    test('should return 404 if test answer not found', async () => {
      const response = await request(app)
        .get('/api/testanswers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestAnswer not found');
    });
  });

  describe('GET /api/testanswers/search', () => {
    test('should return matching test answers and status 200', async () => {
      await TestAnswer.create({
        AnswerText: 'Searchable Answer',
        ImagePath: 'http://example.com/images/searchable.png',
        IsRightAnswer: true
      });

      const response = await request(app)
        .get('/api/testanswers/search')
        .query({ answerText: 'Searchable' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].AnswerText).toContain('Searchable');
    });

    test('should return 404 if no test answers match the criteria', async () => {
      const response = await request(app)
        .get('/api/testanswers/search')
        .query({ answerText: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No test answers found matching the criteria.');
    });
  });

  describe('PUT /api/testanswers/:id', () => {
    test('should update a test answer and return status 200', async () => {
      const testAnswer = await TestAnswer.create({
        AnswerText: 'Original Answer',
        ImagePath: 'http://example.com/images/original.png',
        IsRightAnswer: false
      });

      const updatedData = {
        AnswerText: 'Updated Answer'
      };

      const response = await request(app)
        .put(`/api/testanswers/${testAnswer.TestAnswerId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.AnswerText).toBe('Updated Answer');
    });

    test('should return 404 if test answer not found', async () => {
      const response = await request(app)
        .put('/api/testanswers/999')
        .send({ AnswerText: 'Updated Answer' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestAnswer not found');
    });
  });

  describe('DELETE /api/testanswers/:id', () => {
    test('should delete a test answer and return status 204', async () => {
      const testAnswer = await TestAnswer.create({
        AnswerText: 'Answer to Delete',
        ImagePath: 'http://example.com/images/delete.png',
        IsRightAnswer: true
      });

      const response = await request(app)
        .delete(`/api/testanswers/${testAnswer.TestAnswerId}`);

      expect(response.status).toBe(204);

      const deletedTestAnswer = await TestAnswer.findByPk(testAnswer.TestAnswerId);
      expect(deletedTestAnswer).toBeNull();
    });

    test('should return 404 if test answer not found', async () => {
      const response = await request(app)
        .delete('/api/testanswers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestAnswer not found');
    });
  });
});