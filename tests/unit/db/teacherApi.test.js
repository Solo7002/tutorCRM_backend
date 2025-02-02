const request = require('supertest');
const app = require('../../../src/app');
const { User, Teacher } = require('../../../src/models/dbModels');

describe('Teacher API Tests', () => {
  describe('POST /api/teachers', () => {
    test('should create a new teacher and return status 201', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const newTeacher = {
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId,
      };

      const response = await request(app)
        .post('/api/teachers')
        .send(newTeacher);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('TeacherId');
      expect(response.body.AboutTeacher).toBe('Experienced tutor');
      expect(response.body.LessonType).toBe('group');
      expect(response.body.MeetingType).toBe('online');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 400 for invalid input (missing LessonType)', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const invalidTeacher = {
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        MeetingType: 'online',
        UserId: testUser.UserId,
      };

      const response = await request(app)
        .post('/api/teachers')
        .send(invalidTeacher);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: LessonType cannot be empty');
    });
  });

  describe('GET /api/teachers', () => {
    test('should return a list of teachers and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });
      const testUser2 = await User.create({
        Username: `user2${Date.now()}`,
        Password: 'Password123!',
        Email: `user2${Date.now()}@example.com`,
        LastName: 'Smith',
        FirstName: 'Jane',
      });

      await Teacher.create({
        AboutTeacher: 'Math tutor',
        LessonPrice: 50,
        LessonType: 'solo',
        MeetingType: 'offline',
        UserId: testUser1.UserId,
      });
      await Teacher.create({
        AboutTeacher: 'English tutor',
        LessonPrice: 75,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser2.UserId,
      });

      const response = await request(app)
        .get('/api/teachers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/teachers/:id', () => {
    test('should return a teacher by ID and status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId,
      });

      const response = await request(app)
        .get(`/api/teachers/${testTeacher.TeacherId}`);

      expect(response.status).toBe(200);
      expect(response.body.AboutTeacher).toBe('Experienced tutor');
      expect(response.body.LessonType).toBe('group');
      expect(response.body.MeetingType).toBe('online');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 404 if teacher not found', async () => {
      const response = await request(app)
        .get('/api/teachers/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });

  describe('GET /api/teachers/search', () => {
    test('should return matching teachers and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });
      const testUser2 = await User.create({
        Username: `user2${Date.now()}`,
        Password: 'Password123!',
        Email: `user2${Date.now()}@example.com`,
        LastName: 'Smith',
        FirstName: 'Jane',
      });

      await Teacher.create({
        AboutTeacher: 'Math tutor',
        LessonPrice: 50,
        LessonType: 'solo',
        MeetingType: 'offline',
        UserId: testUser1.UserId,
      });
      await Teacher.create({
        AboutTeacher: 'English tutor',
        LessonPrice: 75,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser2.UserId,
      });

      const response = await request(app)
        .get('/api/teachers/search')
        .query({ lessonType: 'group' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].LessonType).toBe('group');
    });

    test('should return 404 if no teachers match the criteria', async () => {
      const response = await request(app)
        .get('/api/teachers/search')
        .query({ lessonType: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No teachers found.');
    });
  });

  describe('PUT /api/teachers/:id', () => {
    test('should update a teacher and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId,
      });

      const updatedData = {
        AboutTeacher: 'Updated tutor info',
        LessonPrice: 60,
        LessonType: 'solo',
        MeetingType: 'offline',
      };

      const response = await request(app)
        .put(`/api/teachers/${testTeacher.TeacherId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.AboutTeacher).toBe('Updated tutor info');
      expect(response.body.LessonPrice).toBe(60);
      expect(response.body.LessonType).toBe('solo');
      expect(response.body.MeetingType).toBe('offline');
    });

    test('should return 404 if teacher not found', async () => {
      const response = await request(app)
        .put('/api/teachers/999')
        .send({ AboutTeacher: 'Updated tutor info', LessonPrice: 60 });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });

  describe('DELETE /api/teachers/:id', () => {
    test('should delete a teacher and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Experienced tutor',
        LessonPrice: 50,
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId,
      });

      const response = await request(app)
        .delete(`/api/teachers/${testTeacher.TeacherId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Teacher deleted');

      const deletedTeacher = await Teacher.findByPk(testTeacher.TeacherId);
      expect(deletedTeacher).toBeNull();
    });

    test('should return 404 if teacher not found', async () => {
      const response = await request(app)
        .delete('/api/teachers/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Teacher not found');
    });
  });
});