const request = require('supertest');
const app = require('../../../src/app');
const { User, Teacher, Subject, Location, Course } = require('../../../src/models/dbModels');

describe('Course API Tests', () => {
  describe('POST /api/courses', () => {
    test('should create a new course and return status 201', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Test teacher',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId
      });

      const testSubject = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      const newCourse = {
        CourseName: 'Advanced Math',
        TeacherId: testTeacher.TeacherId,
        SubjectId: testSubject.SubjectId,
        LocationId: testLocation.LocationId,
        GroupPrice: 100
      };

      const response = await request(app)
        .post('/api/courses')
        .send(newCourse);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('CourseId');
      expect(response.body.CourseName).toBe('Advanced Math');
      expect(response.body.TeacherId).toBe(testTeacher.TeacherId);
      expect(response.body.SubjectId).toBe(testSubject.SubjectId);
      expect(response.body.LocationId).toBe(testLocation.LocationId);
    });

    test('should return 400 for invalid input (missing CourseName)', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Test teacher',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId
      });

      const testSubject = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      const invalidCourse = {
        TeacherId: testTeacher.TeacherId,
        SubjectId: testSubject.SubjectId,
        LocationId: testLocation.LocationId,
        GroupPrice: 100
      };

      const response = await request(app)
        .post('/api/courses')
        .send(invalidCourse);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: CourseName cannot be empty');
    });
  });

  describe('GET /api/courses', () => {
    test('should return a list of courses and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher1 = await Teacher.create({
        AboutTeacher: 'Teacher A',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser1.UserId
      });

      const testSubject1 = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation1 = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      await Course.create({
        CourseName: 'Course A',
        TeacherId: testTeacher1.TeacherId,
        SubjectId: testSubject1.SubjectId,
        LocationId: testLocation1.LocationId,
        GroupPrice: 100
      });

      const response = await request(app)
        .get('/api/courses');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/courses/:id', () => {
    test('should return a course by ID and status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Test teacher',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId
      });

      const testSubject = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      const testCourse = await Course.create({
        CourseName: 'Advanced Math',
        TeacherId: testTeacher.TeacherId,
        SubjectId: testSubject.SubjectId,
        LocationId: testLocation.LocationId,
        GroupPrice: 100
      });

      const response = await request(app)
        .get(`/api/courses/${testCourse.CourseId}`);

      expect(response.status).toBe(200);
      expect(response.body.CourseName).toBe('Advanced Math');
      expect(response.body.TeacherId).toBe(testTeacher.TeacherId);
      expect(response.body.SubjectId).toBe(testSubject.SubjectId);
      expect(response.body.LocationId).toBe(testLocation.LocationId);
    });

    test('should return 404 if course not found', async () => {
      const response = await request(app)
        .get('/api/courses/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Course not found');
    });
  });

  describe('GET /api/courses/search', () => {
    test('should return matching courses and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher1 = await Teacher.create({
        AboutTeacher: 'Teacher A',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser1.UserId
      });

      const testSubject1 = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation1 = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      await Course.create({
        CourseName: 'Math Course',
        TeacherId: testTeacher1.TeacherId,
        SubjectId: testSubject1.SubjectId,
        LocationId: testLocation1.LocationId,
        GroupPrice: 100
      });

      const response = await request(app)
        .get('/api/courses/search')
        .query({ courseName: 'Math' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].CourseName).toContain('Math');
    });

    test('should return 404 if no courses match the criteria', async () => {
      const response = await request(app)
        .get('/api/courses/search')
        .query({ courseName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No courses found matching the criteria.');
    });
  });

  describe('PUT /api/courses/:id', () => {
    test('should update a course and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Test teacher',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId
      });

      const testSubject = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      const testCourse = await Course.create({
        CourseName: 'Basic Math',
        TeacherId: testTeacher.TeacherId,
        SubjectId: testSubject.SubjectId,
        LocationId: testLocation.LocationId,
        GroupPrice: 50
      });

      const updatedData = {
        CourseName: 'Updated Math Course',
        GroupPrice: 75
      };

      const response = await request(app)
        .put(`/api/courses/${testCourse.CourseId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.CourseName).toBe('Updated Math Course');
      expect(response.body.GroupPrice).toBe(75);
    });

    test('should return 404 if course not found', async () => {
      const response = await request(app)
        .put('/api/courses/999')
        .send({ CourseName: 'Updated Course' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Course not found');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    test('should delete a course and return status 204', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testTeacher = await Teacher.create({
        AboutTeacher: 'Test teacher',
        LessonType: 'group',
        MeetingType: 'online',
        UserId: testUser.UserId
      });

      const testSubject = await Subject.create({
        SubjectName: 'Mathematics'
      });

      const testLocation = await Location.create({
        City: 'New York',
        Country: 'USA'
      });

      const testCourse = await Course.create({
        CourseName: 'Advanced Math',
        TeacherId: testTeacher.TeacherId,
        SubjectId: testSubject.SubjectId,
        LocationId: testLocation.LocationId,
        GroupPrice: 100
      });

      const response = await request(app)
        .delete(`/api/courses/${testCourse.CourseId}`);

      expect(response.status).toBe(204);

      const deletedCourse = await Course.findByPk(testCourse.CourseId);
      expect(deletedCourse).toBeNull();
    });

    test('should return 404 if course not found', async () => {
      const response = await request(app)
        .delete('/api/courses/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Course not found');
    });
  });
});