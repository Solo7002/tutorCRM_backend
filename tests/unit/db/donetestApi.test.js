const request = require('supertest');
const app = require('../../../src/app');
const { User, Student, Test, DoneTest } = require('../../../src/models/dbModels');

describe('DoneTest API Tests', () => {
  describe('POST /api/donetests', () => {
    test('should create a new done test and return status 201', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId
      });

      const testTest = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      const newDoneTest = {
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        TestId: testTest.TestId
      };

      const response = await request(app)
        .post('/api/donetests')
        .send(newDoneTest);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('DoneTestId');
      expect(response.body.Mark).toBe(85);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.TestId).toBe(testTest.TestId);
    });

    test('should return 400 for invalid input (missing Mark)', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId
      });

      const testTest = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      const invalidDoneTest = {
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        TestId: testTest.TestId
      };

      const response = await request(app)
        .post('/api/donetests')
        .send(invalidDoneTest);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: Mark must be an integer');
    });
  });

  describe('GET /api/donetests', () => {
    test('should return a list of done tests and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent1 = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser1.UserId
      });

      const testTest1 = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      await DoneTest.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        TestId: testTest1.TestId
      });

      const response = await request(app)
        .get('/api/donetests');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/donetests/:id', () => {
    test('should return a done test by ID and status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId
      });

      const testTest = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      const testDoneTest = await DoneTest.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        TestId: testTest.TestId
      });

      const response = await request(app)
        .get(`/api/donetests/${testDoneTest.DoneTestId}`);

      expect(response.status).toBe(200);
      expect(response.body.Mark).toBe(85);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.TestId).toBe(testTest.TestId);
    });

    test('should return 404 if done test not found', async () => {
      const response = await request(app)
        .get('/api/donetests/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneTest not found');
    });
  });

  describe('GET /api/donetests/search', () => {
    test('should return matching done tests and status 200', async () => {
      const testUser1 = await User.create({
        Username: `user1${Date.now()}`,
        Password: 'Password123!',
        Email: `user1${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent1 = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser1.UserId
      });

      const testTest1 = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      await DoneTest.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        TestId: testTest1.TestId
      });

      const response = await request(app)
        .get('/api/donetests/search')
        .query({ studentId: testStudent1.StudentId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].StudentId).toBe(testStudent1.StudentId);
    });

    test('should return 404 if no done tests match the criteria', async () => {
      const response = await request(app)
        .get('/api/donetests/search')
        .query({ studentId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No tests found matching the criteria.');
    });
  });

  describe('PUT /api/donetests/:id', () => {
    test('should update a done test and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId
      });

      const testTest = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      const testDoneTest = await DoneTest.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        TestId: testTest.TestId
      });

      const updatedData = {
        Mark: 95
      };

      const response = await request(app)
        .put(`/api/donetests/${testDoneTest.DoneTestId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.Mark).toBe(95);
    });

    test('should return 404 if done test not found', async () => {
      const response = await request(app)
        .put('/api/donetests/999')
        .send({ Mark: 95 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneTest not found');
    });
  });

  describe('DELETE /api/donetests/:id', () => {
    test('should delete a done test and return status 204', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John'
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId
      });

      const testTest = await Test.create({
        TestName: 'Math Test',
        GroupId: 1
      });

      const testDoneTest = await DoneTest.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        TestId: testTest.TestId
      });

      const response = await request(app)
        .delete(`/api/donetests/${testDoneTest.DoneTestId}`);

      expect(response.status).toBe(204);

      const deletedTest = await DoneTest.findByPk(testDoneTest.DoneTestId);
      expect(deletedTest).toBeNull();
    });

    test('should return 404 if done test not found', async () => {
      const response = await request(app)
        .delete('/api/donetests/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneTest not found');
    });
  });
});