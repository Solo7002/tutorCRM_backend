const request = require('supertest');
const app = require('../../../src/app');
const { User, Student, HomeTask, DoneHomeTask } = require('../../../src/models/dbModels');

describe('DoneHomeTask API Tests', () => {
  describe('POST /api/donehometasks', () => {
    test('should create a new done home task and return status 201', async () => {
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

      const testHomeTask = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      const newDoneHomeTask = {
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        HomeTaskId: testHomeTask.HomeTaskId
      };

      const response = await request(app)
        .post('/api/donehometasks')
        .send(newDoneHomeTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('DoneHomeTaskId');
      expect(response.body.Mark).toBe(85);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.HomeTaskId).toBe(testHomeTask.HomeTaskId);
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

      const testHomeTask = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      const invalidDoneHomeTask = {
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        HomeTaskId: testHomeTask.HomeTaskId
      };

      const response = await request(app)
        .post('/api/donehometasks')
        .send(invalidDoneHomeTask);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: Mark must be an integer');
    });
  });

  describe('GET /api/donehometasks', () => {
    test('should return a list of done home tasks and status 200', async () => {
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

      const testHomeTask1 = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      await DoneHomeTask.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        HomeTaskId: testHomeTask1.HomeTaskId
      });

      const response = await request(app)
        .get('/api/donehometasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/donehometasks/:id', () => {
    test('should return a done home task by ID and status 200', async () => {
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

      const testHomeTask = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      const testDoneHomeTask = await DoneHomeTask.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .get(`/api/donehometasks/${testDoneHomeTask.DoneHomeTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.Mark).toBe(85);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.HomeTaskId).toBe(testHomeTask.HomeTaskId);
    });

    test('should return 404 if done home task not found', async () => {
      const response = await request(app)
        .get('/api/donehometasks/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometask not found');
    });
  });

  describe('GET /api/donehometasks/search', () => {
    test('should return matching done home tasks and status 200', async () => {
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

      const testHomeTask1 = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      await DoneHomeTask.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        HomeTaskId: testHomeTask1.HomeTaskId
      });

      const response = await request(app)
        .get('/api/donehometasks/search')
        .query({ studentId: testStudent1.StudentId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].StudentId).toBe(testStudent1.StudentId);
    });

    test('should return 404 if no done home tasks match the criteria', async () => {
      const response = await request(app)
        .get('/api/donehometasks/search')
        .query({ studentId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No tasks found matching the criteria.');
    });
  });

  describe('PUT /api/donehometasks/:id', () => {
    test('should update a done home task and return status 200', async () => {
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

      const testHomeTask = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      const testDoneHomeTask = await DoneHomeTask.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const updatedData = {
        Mark: 95
      };

      const response = await request(app)
        .put(`/api/donehometasks/${testDoneHomeTask.DoneHomeTaskId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.Mark).toBe(95);
    });

    test('should return 404 if done home task not found', async () => {
      const response = await request(app)
        .put('/api/donehometasks/999')
        .send({ Mark: 95 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometask not found');
    });
  });

  describe('DELETE /api/donehometasks/:id', () => {
    test('should delete a done home task and return status 204', async () => {
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

      const testHomeTask = await HomeTask.create({
        TaskName: 'Math Homework',
        GroupId: 1
      });

      const testDoneHomeTask = await DoneHomeTask.create({
        Mark: 85,
        DoneDate: new Date(),
        StudentId: testStudent.StudentId,
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .delete(`/api/donehometasks/${testDoneHomeTask.DoneHomeTaskId}`);

      expect(response.status).toBe(204);

      const deletedTask = await DoneHomeTask.findByPk(testDoneHomeTask.DoneHomeTaskId);
      expect(deletedTask).toBeNull();
    });

    test('should return 404 if done home task not found', async () => {
      const response = await request(app)
        .delete('/api/donehometasks/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometask not found');
    });
  });
});