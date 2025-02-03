const request = require('supertest');
const app = require('../../../src/app');
const { Material, Teacher } = require('../../../src/models/dbModels');

describe('Material API Tests', () => {
  describe('POST /api/materials', () => {
    test('should create a new material and return status 201', async () => {
      const testTeacher = await Teacher.create({
        Name: 'John Doe',
        Email: 'johndoe@example.com'
      });

      const newMaterial = {
        MaterialName: 'Math Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/math_notes.pdf',
        TeacherId: testTeacher.TeacherId
      };

      const response = await request(app)
        .post('/api/materials')
        .send(newMaterial);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('MaterialId');
      expect(response.body.MaterialName).toBe('Math Notes');
      expect(response.body.Type).toBe('PDF');
      expect(response.body.FilePath).toBe('http://example.com/files/math_notes.pdf');
      expect(response.body.TeacherId).toBe(testTeacher.TeacherId);
    });

    test('should return 400 for invalid input (missing MaterialName)', async () => {
      const testTeacher = await Teacher.create({
        Name: 'John Doe',
        Email: 'johndoe@example.com'
      });

      const invalidMaterial = {
        Type: 'PDF',
        FilePath: 'http://example.com/files/math_notes.pdf',
        TeacherId: testTeacher.TeacherId
      };

      const response = await request(app)
        .post('/api/materials')
        .send(invalidMaterial);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: MaterialName cannot be empty');
    });
  });

  describe('GET /api/materials', () => {
    test('should return a list of materials and status 200', async () => {
      const testTeacher = await Teacher.create({
        Name: 'Jane Smith',
        Email: 'janesmith@example.com'
      });

      await Material.create({
        MaterialName: 'Physics Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/physics_notes.pdf',
        TeacherId: testTeacher.TeacherId
      });

      const response = await request(app)
        .get('/api/materials');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/materials/:id', () => {
    test('should return a material by ID and status 200', async () => {
      const testTeacher = await Teacher.create({
        Name: 'Alice Johnson',
        Email: 'alicejohnson@example.com'
      });

      const testMaterial = await Material.create({
        MaterialName: 'Chemistry Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/chemistry_notes.pdf',
        TeacherId: testTeacher.TeacherId
      });

      const response = await request(app)
        .get(`/api/materials/${testMaterial.MaterialId}`);

      expect(response.status).toBe(200);
      expect(response.body.MaterialName).toBe('Chemistry Notes');
      expect(response.body.Type).toBe('PDF');
      expect(response.body.FilePath).toBe('http://example.com/files/chemistry_notes.pdf');
      expect(response.body.TeacherId).toBe(testTeacher.TeacherId);
    });

    test('should return 404 if material not found', async () => {
      const response = await request(app)
        .get('/api/materials/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Material not found');
    });
  });

  describe('GET /api/materials/search', () => {
    test('should return matching materials and status 200', async () => {
      const testTeacher = await Teacher.create({
        Name: 'Bob Brown',
        Email: 'bobbrown@example.com'
      });

      await Material.create({
        MaterialName: 'Biology Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/biology_notes.pdf',
        TeacherId: testTeacher.TeacherId
      });

      const response = await request(app)
        .get('/api/materials/search')
        .query({ materialName: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].MaterialName).toContain('Biology');
    });

    test('should return 404 if no materials match the criteria', async () => {
      const response = await request(app)
        .get('/api/materials/search')
        .query({ materialName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No materials found matching the criteria.');
    });
  });

  describe('PUT /api/materials/:id', () => {
    test('should update a material and return status 200', async () => {
      const testTeacher = await Teacher.create({
        Name: 'Charlie Davis',
        Email: 'charliedavis@example.com'
      });

      const testMaterial = await Material.create({
        MaterialName: 'History Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/history_notes.pdf',
        TeacherId: testTeacher.TeacherId
      });

      const updatedData = {
        MaterialName: 'Updated History Notes'
      };

      const response = await request(app)
        .put(`/api/materials/${testMaterial.MaterialId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.MaterialName).toBe('Updated History Notes');
    });

    test('should return 404 if material not found', async () => {
      const response = await request(app)
        .put('/api/materials/999')
        .send({ MaterialName: 'Updated Notes' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Material not found');
    });
  });

  describe('DELETE /api/materials/:id', () => {
    test('should delete a material and return status 200', async () => {
      const testTeacher = await Teacher.create({
        Name: 'Eve Wilson',
        Email: 'evewilson@example.com'
      });

      const testMaterial = await Material.create({
        MaterialName: 'Geography Notes',
        Type: 'PDF',
        FilePath: 'http://example.com/files/geography_notes.pdf',
        TeacherId: testTeacher.TeacherId
      });

      const response = await request(app)
        .delete(`/api/materials/${testMaterial.MaterialId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Material deleted');

      const deletedMaterial = await Material.findByPk(testMaterial.MaterialId);
      expect(deletedMaterial).toBeNull();
    });

    test('should return 404 if material not found', async () => {
      const response = await request(app)
        .delete('/api/materials/999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Material not found');
    });
  });
});