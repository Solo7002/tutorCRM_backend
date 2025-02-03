const request = require('supertest');
const app = require('../../../src/app');
const { User, Student } = require('../../../src/models/dbModels');

describe('Student API Tests', () => {
  describe('POST /api/students', () => {
    test('should create a new student and return status 201', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const newStudent = {
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId,
      };

      const response = await request(app)
        .post('/api/students')
        .send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('StudentId');
      expect(response.body.SchoolName).toBe('Test School');
      expect(response.body.Grade).toBe('10th');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 400 for invalid input (empty SchoolName)', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const invalidStudent = {
        SchoolName: '',
        Grade: '10th',
        UserId: testUser.UserId,
      };

      const response = await request(app)
        .post('/api/students')
        .send(invalidStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: SchoolName cannot be empty');
    });
  });

  describe('GET /api/students', () => {
    test('should return a list of students and status 200', async () => {
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

      await Student.create({
        SchoolName: 'School A',
        Grade: '10th',
        UserId: testUser1.UserId,
      });
      await Student.create({
        SchoolName: 'School B',
        Grade: '11th',
        UserId: testUser2.UserId,
      });

      const response = await request(app)
        .get('/api/students');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/students/:id', () => {
    test('should return a student by ID and status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId,
      });

      const response = await request(app)
        .get(`/api/students/${testStudent.StudentId}`);

      expect(response.status).toBe(200);
      expect(response.body.SchoolName).toBe('Test School');
      expect(response.body.Grade).toBe('10th');
      expect(response.body.UserId).toBe(testUser.UserId);
    });

    test('should return 404 if student not found', async () => {
      const response = await request(app)
        .get('/api/students/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('PUT /api/students/:id', () => {
    test('should update a student and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId,
      });

      const updatedData = {
        SchoolName: 'Updated School',
        Grade: '11th',
      };

      const response = await request(app)
        .put(`/api/students/${testStudent.StudentId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.SchoolName).toBe('Updated School');
      expect(response.body.Grade).toBe('11th');
    });

    test('should return 404 if student not found', async () => {
      const response = await request(app)
        .put('/api/students/999')
        .send({ SchoolName: 'Updated School', Grade: '11th' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });

  describe('DELETE /api/students/:id', () => {
    test('should delete a student and return status 200', async () => {
      const testUser = await User.create({
        Username: `user${Date.now()}`,
        Password: 'Password123!',
        Email: `test${Date.now()}@example.com`,
        LastName: 'Doe',
        FirstName: 'John',
      });

      const testStudent = await Student.create({
        SchoolName: 'Test School',
        Grade: '10th',
        UserId: testUser.UserId,
      });

      const response = await request(app)
        .delete(`/api/students/${testStudent.StudentId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Student deleted');

      const deletedStudent = await Student.findByPk(testStudent.StudentId);
      expect(deletedStudent).toBeNull();
    });

    test('should return 404 if student not found', async () => {
      const response = await request(app)
        .delete('/api/students/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Student not found');
    });
  });
});