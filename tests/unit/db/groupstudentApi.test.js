const request = require('supertest');
const app = require('../../../src/app');
const { Group, Student, GroupStudent } = require('../../../src/models/dbModels');

describe('GroupStudent API Tests', () => {
  describe('POST /api/groupstudents', () => {
    test('should create a new group student and return status 201', async () => {
      const testGroup = await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const newGroupStudent = {
        GroupId: testGroup.GroupId,
        StudentId: testStudent.StudentId
      };

      const response = await request(app)
        .post('/api/groupstudents')
        .send(newGroupStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('GroupId', testGroup.GroupId);
      expect(response.body).toHaveProperty('StudentId', testStudent.StudentId);
    });

    test('should return 400 for invalid input (missing GroupId)', async () => {
      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const invalidGroupStudent = {
        StudentId: testStudent.StudentId
      };

      const response = await request(app)
        .post('/api/groupstudents')
        .send(invalidGroupStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: GroupId cannot be null');
    });
  });

  describe('GET /api/groupstudents', () => {
    test('should return a list of group students and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      await GroupStudent.create({
        GroupId: testGroup.GroupId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get('/api/groupstudents');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('GroupId', testGroup.GroupId);
      expect(response.body[0]).toHaveProperty('StudentId', testStudent.StudentId);
    });
  });

  describe('GET /api/groupstudents/:id', () => {
    test('should return a group student by ID and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Science Group',
        GroupPrice: 150,
        MaxStudents: 25
      });

      const testStudent = await Student.create({
        FirstName: 'Jane',
        LastName: 'Smith',
        SchoolName: 'Test School',
        Grade: '11th'
      });

      const testGroupStudent = await GroupStudent.create({
        GroupId: testGroup.GroupId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get(`/api/groupstudents/${testGroupStudent.GroupStudentId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('GroupId', testGroup.GroupId);
      expect(response.body).toHaveProperty('StudentId', testStudent.StudentId);
    });

    test('should return 404 if group student not found', async () => {
      const response = await request(app)
        .get('/api/groupstudents/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('GroupStudent not found');
    });
  });

  describe('GET /api/groupstudents/search', () => {
    test('should return matching group students and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      await GroupStudent.create({
        GroupId: testGroup.GroupId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get('/api/groupstudents/search')
        .query({ groupId: testGroup.GroupId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].GroupId).toBe(testGroup.GroupId);
    });

    test('should return 404 if no group students match the criteria', async () => {
      const response = await request(app)
        .get('/api/groupstudents/search')
        .query({ groupId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No group students found matching the criteria.');
    });
  });

  describe('PUT /api/groupstudents/:id', () => {
    test('should update a group student and return status 200', async () => {
      const testGroup1 = await Group.create({
        GroupName: 'Physics Group',
        GroupPrice: 200,
        MaxStudents: 30
      });

      const testGroup2 = await Group.create({
        GroupName: 'Chemistry Group',
        GroupPrice: 180,
        MaxStudents: 25
      });

      const testStudent = await Student.create({
        FirstName: 'Alice',
        LastName: 'Johnson',
        SchoolName: 'Test School',
        Grade: '12th'
      });

      const testGroupStudent = await GroupStudent.create({
        GroupId: testGroup1.GroupId,
        StudentId: testStudent.StudentId
      });

      const updatedData = {
        GroupId: testGroup2.GroupId
      };

      const response = await request(app)
        .put(`/api/groupstudents/${testGroupStudent.GroupStudentId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.GroupId).toBe(testGroup2.GroupId);
    });

    test('should return 404 if group student not found', async () => {
      const response = await request(app)
        .put('/api/groupstudents/999')
        .send({ GroupId: 1 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('GroupStudent not found');
    });
  });

  describe('DELETE /api/groupstudents/:id', () => {
    test('should delete a group student and return status 204', async () => {
      const testGroup = await Group.create({
        GroupName: 'Biology Group',
        GroupPrice: 160,
        MaxStudents: 22
      });

      const testStudent = await Student.create({
        FirstName: 'Bob',
        LastName: 'Brown',
        SchoolName: 'Test School',
        Grade: '9th'
      });

      const testGroupStudent = await GroupStudent.create({
        GroupId: testGroup.GroupId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .delete(`/api/groupstudents/${testGroupStudent.GroupStudentId}`);

      expect(response.status).toBe(204);

      const deletedGroupStudent = await GroupStudent.findByPk(testGroupStudent.GroupStudentId);
      expect(deletedGroupStudent).toBeNull();
    });

    test('should return 404 if group student not found', async () => {
      const response = await request(app)
        .delete('/api/groupstudents/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('GroupStudent not found');
    });
  });
});