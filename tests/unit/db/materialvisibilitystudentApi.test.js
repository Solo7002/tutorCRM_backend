const request = require('supertest');
const app = require('../../../src/app');
const { Material, Student, MaterialVisibilityStudent } = require('../../../src/models/dbModels');

describe('MaterialVisibilityStudent API Tests', () => {
  describe('POST /api/materialvisibilitystudents', () => {
    test('should create a new material visibility record and return status 201', async () => {
      const testMaterial = await Material.create({
        MaterialName: 'Math Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/math_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const newMaterialVisibilityStudent = {
        MaterialId: testMaterial.MaterialId,
        StudentId: testStudent.StudentId
      };

      const response = await request(app)
        .post('/api/materialvisibilitystudents')
        .send(newMaterialVisibilityStudent);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('MaterialId', testMaterial.MaterialId);
      expect(response.body).toHaveProperty('StudentId', testStudent.StudentId);
    });

    test('should return 400 for invalid input (missing MaterialId)', async () => {
      const testStudent = await Student.create({
        FirstName: 'John',
        LastName: 'Doe',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const invalidMaterialVisibilityStudent = {
        StudentId: testStudent.StudentId
      };

      const response = await request(app)
        .post('/api/materialvisibilitystudents')
        .send(invalidMaterialVisibilityStudent);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: MaterialId cannot be null');
    });
  });

  describe('GET /api/materialvisibilitystudents', () => {
    test('should return a list of material visibility records and status 200', async () => {
      const testMaterial = await Material.create({
        MaterialName: 'Physics Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/physics_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'Jane',
        LastName: 'Smith',
        SchoolName: 'Test School',
        Grade: '11th'
      });

      await MaterialVisibilityStudent.create({
        MaterialId: testMaterial.MaterialId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get('/api/materialvisibilitystudents');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('MaterialId', testMaterial.MaterialId);
      expect(response.body[0]).toHaveProperty('StudentId', testStudent.StudentId);
    });
  });

  describe('GET /api/materialvisibilitystudents/:id', () => {
    test('should return a material visibility record by ID and status 200', async () => {
      const testMaterial = await Material.create({
        MaterialName: 'Chemistry Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/chemistry_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'Alice',
        LastName: 'Johnson',
        SchoolName: 'Test School',
        Grade: '12th'
      });

      const testMaterialVisibilityStudent = await MaterialVisibilityStudent.create({
        MaterialId: testMaterial.MaterialId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get(`/api/materialvisibilitystudents/${testMaterialVisibilityStudent.MaterialVisibilityStudentId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('MaterialId', testMaterial.MaterialId);
      expect(response.body).toHaveProperty('StudentId', testStudent.StudentId);
    });

    test('should return 404 if material visibility record not found', async () => {
      const response = await request(app)
        .get('/api/materialvisibilitystudents/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MaterialVisibilityStudent not found');
    });
  });

  describe('GET /api/materialvisibilitystudents/search', () => {
    test('should return matching material visibility records and status 200', async () => {
      const testMaterial = await Material.create({
        MaterialName: 'Biology Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/biology_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'Bob',
        LastName: 'Brown',
        SchoolName: 'Test School',
        Grade: '9th'
      });

      await MaterialVisibilityStudent.create({
        MaterialId: testMaterial.MaterialId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .get('/api/materialvisibilitystudents/search')
        .query({ studentId: testStudent.StudentId });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].StudentId).toBe(testStudent.StudentId);
    });

    test('should return 404 if no material visibility records match the criteria', async () => {
      const response = await request(app)
        .get('/api/materialvisibilitystudents/search')
        .query({ studentId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No material visibility records found matching the criteria.');
    });
  });

  describe('PUT /api/materialvisibilitystudents/:id', () => {
    test('should update a material visibility record and return status 200', async () => {
      const testMaterial1 = await Material.create({
        MaterialName: 'History Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/history_notes.pdf',
        TeacherId: 1
      });

      const testMaterial2 = await Material.create({
        MaterialName: 'Geography Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/geography_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'Charlie',
        LastName: 'Davis',
        SchoolName: 'Test School',
        Grade: '10th'
      });

      const testMaterialVisibilityStudent = await MaterialVisibilityStudent.create({
        MaterialId: testMaterial1.MaterialId,
        StudentId: testStudent.StudentId
      });

      const updatedData = {
        MaterialId: testMaterial2.MaterialId
      };

      const response = await request(app)
        .put(`/api/materialvisibilitystudents/${testMaterialVisibilityStudent.MaterialVisibilityStudentId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.MaterialId).toBe(testMaterial2.MaterialId);
    });

    test('should return 404 if material visibility record not found', async () => {
      const response = await request(app)
        .put('/api/materialvisibilitystudents/999')
        .send({ MaterialId: 1 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MaterialVisibilityStudent not found');
    });
  });

  describe('DELETE /api/materialvisibilitystudents/:id', () => {
    test('should delete a material visibility record and return status 204', async () => {
      const testMaterial = await Material.create({
        MaterialName: 'Art Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/art_notes.pdf',
        TeacherId: 1
      });

      const testStudent = await Student.create({
        FirstName: 'Eve',
        LastName: 'Wilson',
        SchoolName: 'Test School',
        Grade: '11th'
      });

      const testMaterialVisibilityStudent = await MaterialVisibilityStudent.create({
        MaterialId: testMaterial.MaterialId,
        StudentId: testStudent.StudentId
      });

      const response = await request(app)
        .delete(`/api/materialvisibilitystudents/${testMaterialVisibilityStudent.MaterialVisibilityStudentId}`);

      expect(response.status).toBe(204);

      const deletedRecord = await MaterialVisibilityStudent.findByPk(testMaterialVisibilityStudent.MaterialVisibilityStudentId);
      expect(deletedRecord).toBeNull();
    });

    test('should return 404 if material visibility record not found', async () => {
      const response = await request(app)
        .delete('/api/materialvisibilitystudents/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('MaterialVisibilityStudent not found');
    });
  });
});