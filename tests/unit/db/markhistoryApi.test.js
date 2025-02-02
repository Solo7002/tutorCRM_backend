const request = require('supertest');
const app = require('../../../src/app');
const { MarkHistory, Student, Course } = require('../../../src/models/dbModels');

describe('MarkHistory API Tests', () => {
  describe('POST /api/markhistories', () => {
    test('should create a new mark history and return status 201', async () => {
      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const testCourse = await Course.create({
        CourseName: 'Mathematics',
        CourseDescription: 'Advanced Math Course'
      });

      const newMarkHistory = {
        MarkType: 'Exam',
        Mark: 95,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      };

      const response = await request(app)
        .post('/api/markhistories')
        .send(newMarkHistory);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('MarkHistoryId');
      expect(response.body.MarkType).toBe('Exam');
      expect(response.body.Mark).toBe(95);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.CourseId).toBe(testCourse.CourseId);
    });

    test('should return 400 for invalid input (missing Mark)', async () => {
      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const testCourse = await Course.create({
        CourseName: 'Mathematics',
        CourseDescription: 'Advanced Math Course'
      });

      const invalidMarkHistory = {
        MarkType: 'Exam',
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      };

      const response = await request(app)
        .post('/api/markhistories')
        .send(invalidMarkHistory);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: Mark must be an integer');
    });
  });

  describe('GET /api/markhistories', () => {
    test('should return a list of mark histories and status 200', async () => {
      const testStudent = await Student.create({
        FirstName: 'Jane',
        LastName: 'Smith',
        SchoolName: 'Test School',
        Grade: '11th'
      });

      const testCourse = await Course.create({
        CourseName: 'Physics',
        CourseDescription: 'Advanced Physics Course'
      });

      await MarkHistory.create({
        MarkType: 'Quiz',
        Mark: 85,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      });

      const response = await request(app)
        .get('/api/markhistories');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/markhistories/:id', () => {
    test('should return a mark history by ID and status 200', async () => {
      const testStudent = await Student.create({
        FirstName: 'Alice',
        LastName: 'Johnson',
        SchoolName: 'Test School',
        Grade: '12th'
      });

      const testCourse = await Course.create({
        CourseName: 'Chemistry',
        CourseDescription: 'Advanced Chemistry Course'
      });

      const testMarkHistory = await MarkHistory.create({
        MarkType: 'Assignment',
        Mark: 90,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      });

      const response = await request(app)
        .get(`/api/markhistories/${testMarkHistory.MarkHistoryId}`);

      expect(response.status).toBe(200);
      expect(response.body.MarkType).toBe('Assignment');
      expect(response.body.Mark).toBe(90);
      expect(response.body.StudentId).toBe(testStudent.StudentId);
      expect(response.body.CourseId).toBe(testCourse.CourseId);
    });

    test('should return 404 if mark history not found', async () => {
      const response = await request(app)
        .get('/api/markhistories/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MarkHistory not found');
    });
  });

  describe('GET /api/markhistories/search', () => {
    test('should return matching mark histories and status 200', async () => {
      const testStudent = await Student.create({
        FirstName: 'Bob',
        LastName: 'Brown',
        SchoolName: 'Test School',
        Grade: '9th'
      });

      const testCourse = await Course.create({
        CourseName: 'Biology',
        CourseDescription: 'Advanced Biology Course'
      });

      await MarkHistory.create({
        MarkType: 'Exam',
        Mark: 88,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      });

      const response = await request(app)
        .get('/api/markhistories/search')
        .query({ studentId: testStudent.StudentId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].StudentId).toBe(testStudent.StudentId);
    });

    test('should return 404 if no mark histories match the criteria', async () => {
      const response = await request(app)
        .get('/api/markhistories/search')
        .query({ studentId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No mark histories found matching the criteria.');
    });
  });

  describe('PUT /api/markhistories/:id', () => {
    test('should update a mark history and return status 200', async () => {
      const testStudent = await Student.create({
        FirstName: 'Charlie',
        LastName: 'Davis',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const testCourse = await Course.create({
        CourseName: 'History',
        CourseDescription: 'Advanced History Course'
      });

      const testMarkHistory = await MarkHistory.create({
        MarkType: 'Project',
        Mark: 75,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      });

      const updatedData = {
        Mark: 80
      };

      const response = await request(app)
        .put(`/api/markhistories/${testMarkHistory.MarkHistoryId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.Mark).toBe(80);
    });

    test('should return 404 if mark history not found', async () => {
      const response = await request(app)
        .put('/api/markhistories/999')
        .send({ Mark: 80 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MarkHistory not found');
    });
  });

  describe('DELETE /api/markhistories/:id', () => {
    test('should delete a mark history and return status 204', async () => {
      const testStudent = await Student.create({
        FirstName: 'Eve',
        LastName: 'Wilson',
        SchoolName: 'Test School',
        Grade: '11th'
      });

      const testCourse = await Course.create({
        CourseName: 'Geography',
        CourseDescription: 'Advanced Geography Course'
      });

      const testMarkHistory = await MarkHistory.create({
        MarkType: 'Final Exam',
        Mark: 92,
        MarkDate: new Date(),
        StudentId: testStudent.StudentId,
        CourseId: testCourse.CourseId
      });

      const response = await request(app)
        .delete(`/api/markhistories/${testMarkHistory.MarkHistoryId}`);

      expect(response.status).toBe(204);

      const deletedMarkHistory = await MarkHistory.findByPk(testMarkHistory.MarkHistoryId);
      expect(deletedMarkHistory).toBeNull();
    });

    test('should return 404 if mark history not found', async () => {
      const response = await request(app)
        .delete('/api/markhistories/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MarkHistory not found');
    });
  });
});