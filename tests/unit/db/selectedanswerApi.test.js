const request = require('supertest');
const app = require('../../../src/app');
const { SelectedAnswer } = require('../../../src/models/dbModels');

describe('SelectedAnswer API Tests', () => {
  describe('POST /api/selectedanswers', () => {
    test('should create a new selected answer and return status 201', async () => {
      const newSelectedAnswer = {
        TestQuestionId: 1,
        DoneTestId: 1,
        AnswerText: 'Test Answer',
        IsCorrect: true
      };

      const response = await request(app)
        .post('/api/selectedanswers')
        .send(newSelectedAnswer);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('SelectedAnswerId');
      expect(response.body.TestQuestionId).toBe(1);
      expect(response.body.DoneTestId).toBe(1);
      expect(response.body.AnswerText).toBe('Test Answer');
      expect(response.body.IsCorrect).toBe(true);
    });

    test('should return 400 for invalid input (missing TestQuestionId)', async () => {
      const invalidSelectedAnswer = {
        DoneTestId: 1,
        AnswerText: 'Test Answer',
        IsCorrect: true
      };

      const response = await request(app)
        .post('/api/selectedanswers')
        .send(invalidSelectedAnswer);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: TestQuestionId cannot be null');
    });
  });

  describe('GET /api/selectedanswers', () => {
    test('should return a list of selected answers and status 200', async () => {
      await SelectedAnswer.create({
        TestQuestionId: 2,
        DoneTestId: 2,
        AnswerText: 'Another Test Answer',
        IsCorrect: false
      });

      const response = await request(app)
        .get('/api/selectedanswers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/selectedanswers/:id', () => {
    test('should return a selected answer by ID and status 200', async () => {
      const testSelectedAnswer = await SelectedAnswer.create({
        TestQuestionId: 3,
        DoneTestId: 3,
        AnswerText: 'Test Answer for GET',
        IsCorrect: true
      });

      const response = await request(app)
        .get(`/api/selectedanswers/${testSelectedAnswer.SelectedAnswerId}`);

      expect(response.status).toBe(200);
      expect(response.body.TestQuestionId).toBe(3);
      expect(response.body.DoneTestId).toBe(3);
      expect(response.body.AnswerText).toBe('Test Answer for GET');
      expect(response.body.IsCorrect).toBe(true);
    });

    test('should return 404 if selected answer not found', async () => {
      const response = await request(app)
        .get('/api/selectedanswers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SelectedAnswer not found');
    });
  });

  describe('GET /api/selectedanswers/search', () => {
    test('should return matching selected answers and status 200', async () => {
      await SelectedAnswer.create({
        TestQuestionId: 4,
        DoneTestId: 4,
        AnswerText: 'Searchable Answer',
        IsCorrect: true
      });

      const response = await request(app)
        .get('/api/selectedanswers/search')
        .query({ doneTestId: 4 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].DoneTestId).toBe(4);
    });

    test('should return 404 if no selected answers match the criteria', async () => {
      const response = await request(app)
        .get('/api/selectedanswers/search')
        .query({ doneTestId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No selected answers found.');
    });
  });

  describe('PUT /api/selectedanswers/:id', () => {
    test('should update a selected answer and return status 200', async () => {
      const testSelectedAnswer = await SelectedAnswer.create({
        TestQuestionId: 5,
        DoneTestId: 5,
        AnswerText: 'Original Answer',
        IsCorrect: false
      });

      const updatedData = {
        AnswerText: 'Updated Answer'
      };

      const response = await request(app)
        .put(`/api/selectedanswers/${testSelectedAnswer.SelectedAnswerId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.AnswerText).toBe('Updated Answer');
    });

    test('should return 404 if selected answer not found', async () => {
      const response = await request(app)
        .put('/api/selectedanswers/999')
        .send({ AnswerText: 'Updated Answer' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SelectedAnswer not found');
    });
  });

  describe('DELETE /api/selectedanswers/:id', () => {
    test('should delete a selected answer and return status 204', async () => {
      const testSelectedAnswer = await SelectedAnswer.create({
        TestQuestionId: 6,
        DoneTestId: 6,
        AnswerText: 'Answer to Delete',
        IsCorrect: true
      });

      const response = await request(app)
        .delete(`/api/selectedanswers/${testSelectedAnswer.SelectedAnswerId}`);

      expect(response.status).toBe(204);

      const deletedSelectedAnswer = await SelectedAnswer.findByPk(testSelectedAnswer.SelectedAnswerId);
      expect(deletedSelectedAnswer).toBeNull();
    });

    test('should return 404 if selected answer not found', async () => {
      const response = await request(app)
        .delete('/api/selectedanswers/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SelectedAnswer not found');
    });
  });
});