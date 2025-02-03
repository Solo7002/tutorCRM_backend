const request = require('supertest');
const app = require('../../../src/app');
const { SaleMaterialFile } = require('../../../src/models/dbModels');

describe('SaleMaterialFile API Tests', () => {
  describe('POST /api/salematerialfiles', () => {
    test('should create a new sale material file and return status 201', async () => {
      const newSaleMaterialFile = {
        FilePath: 'http://example.com/files/math_book.pdf',
        FileName: 'Math Book',
        AppearedDate: new Date(),
        SaleMaterialId: 1,
        PurchasedMaterialId: 1
      };

      const response = await request(app)
        .post('/api/salematerialfiles')
        .send(newSaleMaterialFile);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('SaleMaterialFileId');
      expect(response.body.FilePath).toBe('http://example.com/files/math_book.pdf');
      expect(response.body.FileName).toBe('Math Book');
      expect(new Date(response.body.AppearedDate)).toBeInstanceOf(Date);
      expect(response.body.SaleMaterialId).toBe(1);
      expect(response.body.PurchasedMaterialId).toBe(1);
    });

    test('should return 400 for invalid input (missing FilePath)', async () => {
      const invalidSaleMaterialFile = {
        FileName: 'Math Book',
        AppearedDate: new Date(),
        SaleMaterialId: 1,
        PurchasedMaterialId: 1
      };

      const response = await request(app)
        .post('/api/salematerialfiles')
        .send(invalidSaleMaterialFile);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: FilePath cannot be empty');
    });
  });

  describe('GET /api/salematerialfiles', () => {
    test('should return a list of sale material files and status 200', async () => {
      await SaleMaterialFile.create({
        FilePath: 'http://example.com/files/science_book.pdf',
        FileName: 'Science Book',
        AppearedDate: new Date(),
        SaleMaterialId: 2,
        PurchasedMaterialId: 2
      });

      const response = await request(app)
        .get('/api/salematerialfiles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/salematerialfiles/:id', () => {
    test('should return a sale material file by ID and status 200', async () => {
      const testSaleMaterialFile = await SaleMaterialFile.create({
        FilePath: 'http://example.com/files/chemistry_book.pdf',
        FileName: 'Chemistry Book',
        AppearedDate: new Date(),
        SaleMaterialId: 3,
        PurchasedMaterialId: 3
      });

      const response = await request(app)
        .get(`/api/salematerialfiles/${testSaleMaterialFile.SaleMaterialFileId}`);

      expect(response.status).toBe(200);
      expect(response.body.FilePath).toBe('http://example.com/files/chemistry_book.pdf');
      expect(response.body.FileName).toBe('Chemistry Book');
      expect(new Date(response.body.AppearedDate)).toBeInstanceOf(Date);
      expect(response.body.SaleMaterialId).toBe(3);
      expect(response.body.PurchasedMaterialId).toBe(3);
    });

    test('should return 404 if sale material file not found', async () => {
      const response = await request(app)
        .get('/api/salematerialfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterialFile not found');
    });
  });

  describe('GET /api/salematerialfiles/search', () => {
    test('should return matching sale material files and status 200', async () => {
      await SaleMaterialFile.create({
        FilePath: 'http://example.com/files/biology_book.pdf',
        FileName: 'Biology Book',
        AppearedDate: new Date(),
        SaleMaterialId: 4,
        PurchasedMaterialId: 4
      });

      const response = await request(app)
        .get('/api/salematerialfiles/search')
        .query({ fileName: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].FileName).toContain('Biology');
    });

    test('should return 404 if no sale material files match the criteria', async () => {
      const response = await request(app)
        .get('/api/salematerialfiles/search')
        .query({ fileName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No sale material files found matching the criteria.');
    });
  });

  describe('PUT /api/salematerialfiles/:id', () => {
    test('should update a sale material file and return status 200', async () => {
      const testSaleMaterialFile = await SaleMaterialFile.create({
        FilePath: 'http://example.com/files/history_book.pdf',
        FileName: 'History Book',
        AppearedDate: new Date(),
        SaleMaterialId: 5,
        PurchasedMaterialId: 5
      });

      const updatedData = {
        FileName: 'Updated History Book'
      };

      const response = await request(app)
        .put(`/api/salematerialfiles/${testSaleMaterialFile.SaleMaterialFileId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.FileName).toBe('Updated History Book');
    });

    test('should return 404 if sale material file not found', async () => {
      const response = await request(app)
        .put('/api/salematerialfiles/999')
        .send({ FileName: 'Updated Book' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterialFile not found');
    });
  });

  describe('DELETE /api/salematerialfiles/:id', () => {
    test('should delete a sale material file and return status 204', async () => {
      const testSaleMaterialFile = await SaleMaterialFile.create({
        FilePath: 'http://example.com/files/geography_book.pdf',
        FileName: 'Geography Book',
        AppearedDate: new Date(),
        SaleMaterialId: 6,
        PurchasedMaterialId: 6
      });

      const response = await request(app)
        .delete(`/api/salematerialfiles/${testSaleMaterialFile.SaleMaterialFileId}`);

      expect(response.status).toBe(204);

      const deletedSaleMaterialFile = await SaleMaterialFile.findByPk(testSaleMaterialFile.SaleMaterialFileId);
      expect(deletedSaleMaterialFile).toBeNull();
    });

    test('should return 404 if sale material file not found', async () => {
      const response = await request(app)
        .delete('/api/salematerialfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterialFile not found');
    });
  });
});