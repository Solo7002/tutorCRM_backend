const request = require('supertest');
const app = require('../../../src/app');
const { PlannedLesson } = require('../../../src/models/dbModels');

describe('PlannedLesson API Tests', () => {
  describe('POST /api/plannedlessons', () => {
    test('should create a new planned lesson and return status 201', async () => {
      const newPlannedLesson = {
        LessonHeader: 'Math Lesson',
        LessonPrice: 50,
        IsPaid: false,
        GroupId: 1
      };

      const response = await request(app)
        .post('/api/plannedlessons')
        .send(newPlannedLesson);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('PlannedLessonId');
      expect(response.body.LessonHeader).toBe('Math Lesson');
      expect(response.body.LessonPrice).toBe(50);
      expect(response.body.IsPaid).toBe(false);
      expect(response.body.GroupId).toBe(1);
    });

    test('should return 400 for invalid input (missing LessonHeader)', async () => {
      const invalidPlannedLesson = {
        LessonPrice: 50,
        IsPaid: false,
        GroupId: 1
      };

      const response = await request(app)
        .post('/api/plannedlessons')
        .send(invalidPlannedLesson);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: LessonHeader cannot be empty');
    });
  });

  describe('GET /api/plannedlessons', () => {
    test('should return a list of planned lessons and status 200', async () => {
      await PlannedLesson.create({
        LessonHeader: 'Science Lesson',
        LessonPrice: 60,
        IsPaid: true,
        GroupId: 1
      });

      const response = await request(app)
        .get('/api/plannedlessons');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/plannedlessons/:id', () => {
    test('should return a planned lesson by ID and status 200', async () => {
      const testPlannedLesson = await PlannedLesson.create({
        LessonHeader: 'Chemistry Lesson',
        LessonPrice: 70,
        IsPaid: false,
        GroupId: 1
      });

      const response = await request(app)
        .get(`/api/plannedlessons/${testPlannedLesson.PlannedLessonId}`);

      expect(response.status).toBe(200);
      expect(response.body.LessonHeader).toBe('Chemistry Lesson');
      expect(response.body.LessonPrice).toBe(70);
      expect(response.body.IsPaid).toBe(false);
      expect(response.body.GroupId).toBe(1);
    });

    test('should return 404 if planned lesson not found', async () => {
      const response = await request(app)
        .get('/api/plannedlessons/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PlannedLesson not found');
    });
  });

  describe('GET /api/plannedlessons/search', () => {
    test('should return matching planned lessons and status 200', async () => {
      await PlannedLesson.create({
        LessonHeader: 'Biology Lesson',
        LessonPrice: 80,
        IsPaid: true,
        GroupId: 1
      });

      const response = await request(app)
        .get('/api/plannedlessons/search')
        .query({ lessonHeader: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].LessonHeader).toContain('Biology');
    });

    test('should return 404 if no planned lessons match the criteria', async () => {
      const response = await request(app)
        .get('/api/plannedlessons/search')
        .query({ lessonHeader: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No planned lessons found matching the criteria.');
    });
  });

  describe('PUT /api/plannedlessons/:id', () => {
    test('should update a planned lesson and return status 200', async () => {
      const testPlannedLesson = await PlannedLesson.create({
        LessonHeader: 'History Lesson',
        LessonPrice: 90,
        IsPaid: false,
        GroupId: 1
      });

      const updatedData = {
        LessonHeader: 'Updated History Lesson'
      };

      const response = await request(app)
        .put(`/api/plannedlessons/${testPlannedLesson.PlannedLessonId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.LessonHeader).toBe('Updated History Lesson');
    });

    test('should return 404 if planned lesson not found', async () => {
      const response = await request(app)
        .put('/api/plannedlessons/999')
        .send({ LessonHeader: 'Updated Lesson' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PlannedLesson not found');
    });
  });

  describe('DELETE /api/plannedlessons/:id', () => {
    test('should delete a planned lesson and return status 204', async () => {
      const testPlannedLesson = await PlannedLesson.create({
        LessonHeader: 'Geography Lesson',
        LessonPrice: 100,
        IsPaid: true,
        GroupId: 1
      });

      const response = await request(app)
        .delete(`/api/plannedlessons/${testPlannedLesson.PlannedLessonId}`);

      expect(response.status).toBe(204);

      const deletedPlannedLesson = await PlannedLesson.findByPk(testPlannedLesson.PlannedLessonId);
      expect(deletedPlannedLesson).toBeNull();
    });

    test('should return 404 if planned lesson not found', async () => {
      const response = await request(app)
        .delete('/api/plannedlessons/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PlannedLesson not found');
    });
  });
});