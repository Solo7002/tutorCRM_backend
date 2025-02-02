const request = require('supertest');
const app = require('../../../src/app');
const { Subject } = require('../../../src/models/dbModels');

describe('Subject API Tests', () => {
  describe('POST /api/subjects', () => {
    test('should create a new subject and return status 201', async () => {
      const newSubject = {
        SubjectName: 'Mathematics'
      };

      const response = await request(app)
        .post('/api/subjects')
        .send(newSubject);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('SubjectId');
      expect(response.body.SubjectName).toBe('Mathematics');
    });

    test('should return 400 for invalid input (missing SubjectName)', async () => {
      const invalidSubject = {};

      const response = await request(app)
        .post('/api/subjects')
        .send(invalidSubject);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: SubjectName cannot be empty');
    });
  });

  describe('GET /api/subjects', () => {
    test('should return a list of subjects and status 200', async () => {
      await Subject.create({
        SubjectName: 'Physics'
      });

      const response = await request(app)
        .get('/api/subjects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/subjects/:id', () => {
    test('should return a subject by ID and status 200', async () => {
      const testSubject = await Subject.create({
        SubjectName: 'Chemistry'
      });

      const response = await request(app)
        .get(`/api/subjects/${testSubject.SubjectId}`);

      expect(response.status).toBe(200);
      expect(response.body.SubjectName).toBe('Chemistry');
    });

    test('should return 404 if subject not found', async () => {
      const response = await request(app)
        .get('/api/subjects/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subject not found');
    });
  });

  describe('GET /api/subjects/search', () => {
    test('should return matching subjects and status 200', async () => {
      await Subject.create({
        SubjectName: 'Biology'
      });

      const response = await request(app)
        .get('/api/subjects/search')
        .query({ subjectName: 'Bio' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].SubjectName).toContain('Bio');
    });

    test('should return 404 if no subjects match the criteria', async () => {
      const response = await request(app)
        .get('/api/subjects/search')
        .query({ subjectName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No subjects found matching the criteria.');
    });
  });

  describe('PUT /api/subjects/:id', () => {
    test('should update a subject and return status 200', async () => {
      const testSubject = await Subject.create({
        SubjectName: 'History'
      });

      const updatedData = {
        SubjectName: 'Updated History'
      };

      const response = await request(app)
        .put(`/api/subjects/${testSubject.SubjectId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.SubjectName).toBe('Updated History');
    });

    test('should return 404 if subject not found', async () => {
      const response = await request(app)
        .put('/api/subjects/999')
        .send({ SubjectName: 'Updated Subject' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subject not found');
    });
  });

  describe('DELETE /api/subjects/:id', () => {
    test('should delete a subject and return status 204', async () => {
      const testSubject = await Subject.create({
        SubjectName: 'Geography'
      });

      const response = await request(app)
        .delete(`/api/subjects/${testSubject.SubjectId}`);

      expect(response.status).toBe(204);

      const deletedSubject = await Subject.findByPk(testSubject.SubjectId);
      expect(deletedSubject).toBeNull();
    });

    test('should return 404 if subject not found', async () => {
      const response = await request(app)
        .delete('/api/subjects/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subject not found');
    });
  });
});