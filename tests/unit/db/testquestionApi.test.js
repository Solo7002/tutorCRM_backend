const request = require('supertest');
const app = require('../../../src/app');
const { TestQuestion } = require('../../../src/models/dbModels');

describe('TestQuestion API Tests', () => {
  describe('POST /api/testquestions', () => {
    test('should create a new test question and return status 201', async () => {
      const newTestQuestion = {
        TestQuestionHeader: 'Math Question',
        TestQuestionDescription: 'What is 2 + 2?',
        ImagePath: 'http://example.com/images/math.png',
        AudioPath: 'http://example.com/audio/math.mp3'
      };

      const response = await request(app)
        .post('/api/testquestions')
        .send(newTestQuestion);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('TestQuestionId');
      expect(response.body.TestQuestionHeader).toBe('Math Question');
      expect(response.body.TestQuestionDescription).toBe('What is 2 + 2?');
      expect(response.body.ImagePath).toBe('http://example.com/images/math.png');
      expect(response.body.AudioPath).toBe('http://example.com/audio/math.mp3');
    });

    test('should return 400 for invalid input (missing TestQuestionHeader)', async () => {
      const invalidTestQuestion = {
        TestQuestionDescription: 'What is 2 + 2?',
        ImagePath: 'http://example.com/images/math.png',
        AudioPath: 'http://example.com/audio/math.mp3'
      };

      const response = await request(app)
        .post('/api/testquestions')
        .send(invalidTestQuestion);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: TestQuestionHeader cannot be empty');
    });
  });

  describe('GET /api/testquestions', () => {
    test('should return a list of test questions and status 200', async () => {
      await TestQuestion.create({
        TestQuestionHeader: 'Science Question',
        TestQuestionDescription: 'What is gravity?',
        ImagePath: 'http://example.com/images/science.png',
        AudioPath: 'http://example.com/audio/science.mp3'
      });

      const response = await request(app)
        .get('/api/testquestions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/testquestions/:id', () => {
    test('should return a test question by ID and status 200', async () => {
      const testQuestion = await TestQuestion.create({
        TestQuestionHeader: 'Chemistry Question',
        TestQuestionDescription: 'What is H2O?',
        ImagePath: 'http://example.com/images/chemistry.png',
        AudioPath: 'http://example.com/audio/chemistry.mp3'
      });

      const response = await request(app)
        .get(`/api/testquestions/${testQuestion.TestQuestionId}`);

      expect(response.status).toBe(200);
      expect(response.body.TestQuestionHeader).toBe('Chemistry Question');
      expect(response.body.TestQuestionDescription).toBe('What is H2O?');
      expect(response.body.ImagePath).toBe('http://example.com/images/chemistry.png');
      expect(response.body.AudioPath).toBe('http://example.com/audio/chemistry.mp3');
    });

    test('should return 404 if test question not found', async () => {
      const response = await request(app)
        .get('/api/testquestions/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestQuestion not found');
    });
  });

  describe('GET /api/testquestions/search', () => {
    test('should return matching test questions and status 200', async () => {
      await TestQuestion.create({
        TestQuestionHeader: 'Biology Question',
        TestQuestionDescription: 'What is photosynthesis?',
        ImagePath: 'http://example.com/images/biology.png',
        AudioPath: 'http://example.com/audio/biology.mp3'
      });

      const response = await request(app)
        .get('/api/testquestions/search')
        .query({ header: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].TestQuestionHeader).toContain('Biology');
    });

    test('should return 404 if no test questions match the criteria', async () => {
      const response = await request(app)
        .get('/api/testquestions/search')
        .query({ header: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No test questions found matching the criteria.');
    });
  });

  describe('PUT /api/testquestions/:id', () => {
    test('should update a test question and return status 200', async () => {
      const testQuestion = await TestQuestion.create({
        TestQuestionHeader: 'History Question',
        TestQuestionDescription: 'Who was the first president?',
        ImagePath: 'http://example.com/images/history.png',
        AudioPath: 'http://example.com/audio/history.mp3'
      });

      const updatedData = {
        TestQuestionHeader: 'Updated History Question'
      };

      const response = await request(app)
        .put(`/api/testquestions/${testQuestion.TestQuestionId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.TestQuestionHeader).toBe('Updated History Question');
    });

    test('should return 404 if test question not found', async () => {
      const response = await request(app)
        .put('/api/testquestions/999')
        .send({ TestQuestionHeader: 'Updated Question' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestQuestion not found');
    });
  });

  describe('DELETE /api/testquestions/:id', () => {
    test('should delete a test question and return status 204', async () => {
      const testQuestion = await TestQuestion.create({
        TestQuestionHeader: 'Geography Question',
        TestQuestionDescription: 'What is the capital of France?',
        ImagePath: 'http://example.com/images/geography.png',
        AudioPath: 'http://example.com/audio/geography.mp3'
      });

      const response = await request(app)
        .delete(`/api/testquestions/${testQuestion.TestQuestionId}`);

      expect(response.status).toBe(204);

      const deletedTestQuestion = await TestQuestion.findByPk(testQuestion.TestQuestionId);
      expect(deletedTestQuestion).toBeNull();
    });

    test('should return 404 if test question not found', async () => {
      const response = await request(app)
        .delete('/api/testquestions/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('TestQuestion not found');
    });
  });
});