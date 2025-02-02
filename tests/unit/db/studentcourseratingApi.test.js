const request = require('supertest');
const app = require('../../../src/app');
const { StudentCourseRating } = require('../../../src/models/dbModels');

describe('StudentCourseRating API Tests', () => {
  describe('POST /api/studentcourseratings', () => {
    test('should create a new student course rating and return status 201', async () => {
      const newRating = {
        StudentId: 1,
        CourseId: 1,
        Rating: 5
      };

      const response = await request(app)
        .post('/api/studentcourseratings')
        .send(newRating);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('StudentCourseRatingId');
      expect(response.body.StudentId).toBe(1);
      expect(response.body.CourseId).toBe(1);
      expect(response.body.Rating).toBe(5);
    });

    test('should return 400 for invalid input (missing Rating)', async () => {
      const invalidRating = {
        StudentId: 1,
        CourseId: 1
      };

      const response = await request(app)
        .post('/api/studentcourseratings')
        .send(invalidRating);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: Rating cannot be null');
    });
  });

  describe('GET /api/studentcourseratings', () => {
    test('should return a list of student course ratings and status 200', async () => {
      await StudentCourseRating.create({
        StudentId: 2,
        CourseId: 2,
        Rating: 4
      });

      const response = await request(app)
        .get('/api/studentcourseratings');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/studentcourseratings/:id', () => {
    test('should return a student course rating by ID and status 200', async () => {
      const testRating = await StudentCourseRating.create({
        StudentId: 3,
        CourseId: 3,
        Rating: 3
      });

      const response = await request(app)
        .get(`/api/studentcourseratings/${testRating.StudentCourseRatingId}`);

      expect(response.status).toBe(200);
      expect(response.body.StudentId).toBe(3);
      expect(response.body.CourseId).toBe(3);
      expect(response.body.Rating).toBe(3);
    });

    test('should return 404 if student course rating not found', async () => {
      const response = await request(app)
        .get('/api/studentcourseratings/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StudentCourseRating not found');
    });
  });

  describe('GET /api/studentcourseratings/search', () => {
    test('should return matching student course ratings and status 200', async () => {
      await StudentCourseRating.create({
        StudentId: 4,
        CourseId: 4,
        Rating: 5
      });

      const response = await request(app)
        .get('/api/studentcourseratings/search')
        .query({ studentId: 4 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].StudentId).toBe(4);
    });

    test('should return 404 if no student course ratings match the criteria', async () => {
      const response = await request(app)
        .get('/api/studentcourseratings/search')
        .query({ studentId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No ratings found.');
    });
  });

  describe('PUT /api/studentcourseratings/:id', () => {
    test('should update a student course rating and return status 200', async () => {
      const testRating = await StudentCourseRating.create({
        StudentId: 5,
        CourseId: 5,
        Rating: 2
      });

      const updatedData = {
        Rating: 4
      };

      const response = await request(app)
        .put(`/api/studentcourseratings/${testRating.StudentCourseRatingId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.Rating).toBe(4);
    });

    test('should return 404 if student course rating not found', async () => {
      const response = await request(app)
        .put('/api/studentcourseratings/999')
        .send({ Rating: 5 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StudentCourseRating not found');
    });
  });

  describe('DELETE /api/studentcourseratings/:id', () => {
    test('should delete a student course rating and return status 204', async () => {
      const testRating = await StudentCourseRating.create({
        StudentId: 6,
        CourseId: 6,
        Rating: 3
      });

      const response = await request(app)
        .delete(`/api/studentcourseratings/${testRating.StudentCourseRatingId}`);

      expect(response.status).toBe(204);

      const deletedRating = await StudentCourseRating.findByPk(testRating.StudentCourseRatingId);
      expect(deletedRating).toBeNull();
    });

    test('should return 404 if student course rating not found', async () => {
      const response = await request(app)
        .delete('/api/studentcourseratings/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('StudentCourseRating not found');
    });
  });
});