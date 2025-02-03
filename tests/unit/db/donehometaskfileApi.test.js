const request = require('supertest');
const app = require('../../../src/app');
const { User, Student, HomeTask, DoneHomeTask, DoneHomeTaskFile } = require('../../../src/models/dbModels');

describe('DoneHomeTaskFile API Tests', () => {
  describe('POST /api/donehometaskfiles', () => {
    test('should create a new done home task file and return status 201', async () => {
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

      const newDoneHomeTaskFile = {
        FileName: 'homework.pdf',
        FilePath: 'http://example.com/files/homework.pdf',
        DoneHomeTaskId: testDoneHomeTask.DoneHomeTaskId
      };

      const response = await request(app)
        .post('/api/donehometaskfiles')
        .send(newDoneHomeTaskFile);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('HometaskFileId');
      expect(response.body.FileName).toBe('homework.pdf');
      expect(response.body.FilePath).toBe('http://example.com/files/homework.pdf');
      expect(response.body.DoneHomeTaskId).toBe(testDoneHomeTask.DoneHomeTaskId);
    });

    test('should return 400 for invalid input (missing FileName)', async () => {
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

      const invalidDoneHomeTaskFile = {
        FilePath: 'http://example.com/files/homework.pdf',
        DoneHomeTaskId: testDoneHomeTask.DoneHomeTaskId
      };

      const response = await request(app)
        .post('/api/donehometaskfiles')
        .send(invalidDoneHomeTaskFile);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: FileName cannot be empty');
    });
  });

  describe('GET /api/donehometaskfiles', () => {
    test('should return a list of done home task files and status 200', async () => {
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

      const testDoneHomeTask1 = await DoneHomeTask.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        HomeTaskId: testHomeTask1.HomeTaskId
      });

      await DoneHomeTaskFile.create({
        FileName: 'math_homework.pdf',
        FilePath: 'http://example.com/files/math_homework.pdf',
        DoneHomeTaskId: testDoneHomeTask1.DoneHomeTaskId
      });

      const response = await request(app)
        .get('/api/donehometaskfiles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/donehometaskfiles/:id', () => {
    test('should return a done home task file by ID and status 200', async () => {
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

      const testDoneHomeTaskFile = await DoneHomeTaskFile.create({
        FileName: 'homework.pdf',
        FilePath: 'http://example.com/files/homework.pdf',
        DoneHomeTaskId: testDoneHomeTask.DoneHomeTaskId
      });

      const response = await request(app)
        .get(`/api/donehometaskfiles/${testDoneHomeTaskFile.HometaskFileId}`);

      expect(response.status).toBe(200);
      expect(response.body.FileName).toBe('homework.pdf');
      expect(response.body.FilePath).toBe('http://example.com/files/homework.pdf');
      expect(response.body.DoneHomeTaskId).toBe(testDoneHomeTask.DoneHomeTaskId);
    });

    test('should return 404 if done home task file not found', async () => {
      const response = await request(app)
        .get('/api/donehometaskfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometaskFile not found');
    });
  });

  describe('GET /api/donehometaskfiles/search', () => {
    test('should return matching done home task files and status 200', async () => {
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

      const testDoneHomeTask1 = await DoneHomeTask.create({
        Mark: 90,
        DoneDate: new Date(),
        StudentId: testStudent1.StudentId,
        HomeTaskId: testHomeTask1.HomeTaskId
      });

      await DoneHomeTaskFile.create({
        FileName: 'math_homework.pdf',
        FilePath: 'http://example.com/files/math_homework.pdf',
        DoneHomeTaskId: testDoneHomeTask1.DoneHomeTaskId
      });

      const response = await request(app)
        .get('/api/donehometaskfiles/search')
        .query({ fileName: 'math' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].FileName).toContain('math');
    });

    test('should return 404 if no done home task files match the criteria', async () => {
      const response = await request(app)
        .get('/api/donehometaskfiles/search')
        .query({ fileName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No files found matching the criteria.');
    });
  });

  describe('PUT /api/donehometaskfiles/:id', () => {
    test('should update a done home task file and return status 200', async () => {
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

      const testDoneHomeTaskFile = await DoneHomeTaskFile.create({
        FileName: 'homework.pdf',
        FilePath: 'http://example.com/files/homework.pdf',
        DoneHomeTaskId: testDoneHomeTask.DoneHomeTaskId
      });

      const updatedData = {
        FileName: 'updated_homework.pdf'
      };

      const response = await request(app)
        .put(`/api/donehometaskfiles/${testDoneHomeTaskFile.HometaskFileId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.FileName).toBe('updated_homework.pdf');
    });

    test('should return 404 if done home task file not found', async () => {
      const response = await request(app)
        .put('/api/donehometaskfiles/999')
        .send({ FileName: 'updated_homework.pdf' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometaskFile not found');
    });
  });

  describe('DELETE /api/donehometaskfiles/:id', () => {
    test('should delete a done home task file and return status 204', async () => {
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

      const testDoneHomeTaskFile = await DoneHomeTaskFile.create({
        FileName: 'homework.pdf',
        FilePath: 'http://example.com/files/homework.pdf',
        DoneHomeTaskId: testDoneHomeTask.DoneHomeTaskId
      });

      const response = await request(app)
        .delete(`/api/donehometaskfiles/${testDoneHomeTaskFile.HometaskFileId}`);

      expect(response.status).toBe(204);

      const deletedFile = await DoneHomeTaskFile.findByPk(testDoneHomeTaskFile.HometaskFileId);
      expect(deletedFile).toBeNull();
    });

    test('should return 404 if done home task file not found', async () => {
      const response = await request(app)
        .delete('/api/donehometaskfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('DoneHometaskFile not found');
    });
  });
});