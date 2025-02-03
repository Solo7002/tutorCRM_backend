const request = require('supertest');
const app = require('../../../src/app');
const { SaleMaterial } = require('../../../src/models/dbModels');

describe('SaleMaterial API Tests', () => {
  describe('POST /api/salematerials', () => {
    test('should create a new sale material and return status 201', async () => {
      const newSaleMaterial = {
        MaterialsHeader: 'Math Book',
        Price: 50,
        VendorId: 1
      };

      const response = await request(app)
        .post('/api/salematerials')
        .send(newSaleMaterial);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('SaleMaterialId');
      expect(response.body.MaterialsHeader).toBe('Math Book');
      expect(response.body.Price).toBe(50);
      expect(response.body.VendorId).toBe(1);
    });

    test('should return 400 for invalid input (missing MaterialsHeader)', async () => {
      const invalidSaleMaterial = {
        Price: 50,
        VendorId: 1
      };

      const response = await request(app)
        .post('/api/salematerials')
        .send(invalidSaleMaterial);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: MaterialsHeader cannot be empty');
    });
  });

  describe('GET /api/salematerials', () => {
    test('should return a list of sale materials and status 200', async () => {
      await SaleMaterial.create({
        MaterialsHeader: 'Science Book',
        Price: 60,
        VendorId: 2
      });

      const response = await request(app)
        .get('/api/salematerials');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/salematerials/:id', () => {
    test('should return a sale material by ID and status 200', async () => {
      const testSaleMaterial = await SaleMaterial.create({
        MaterialsHeader: 'Chemistry Book',
        Price: 70,
        VendorId: 3
      });

      const response = await request(app)
        .get(`/api/salematerials/${testSaleMaterial.SaleMaterialId}`);

      expect(response.status).toBe(200);
      expect(response.body.MaterialsHeader).toBe('Chemistry Book');
      expect(response.body.Price).toBe(70);
      expect(response.body.VendorId).toBe(3);
    });

    test('should return 404 if sale material not found', async () => {
      const response = await request(app)
        .get('/api/salematerials/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterial not found');
    });
  });

  describe('GET /api/salematerials/search', () => {
    test('should return matching sale materials and status 200', async () => {
      await SaleMaterial.create({
        MaterialsHeader: 'Biology Book',
        Price: 80,
        VendorId: 4
      });

      const response = await request(app)
        .get('/api/salematerials/search')
        .query({ materialsHeader: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].MaterialsHeader).toContain('Biology');
    });

    test('should return 404 if no sale materials match the criteria', async () => {
      const response = await request(app)
        .get('/api/salematerials/search')
        .query({ materialsHeader: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No sale materials found matching the criteria.');
    });
  });

  describe('PUT /api/salematerials/:id', () => {
    test('should update a sale material and return status 200', async () => {
      const testSaleMaterial = await SaleMaterial.create({
        MaterialsHeader: 'History Book',
        Price: 90,
        VendorId: 5
      });

      const updatedData = {
        MaterialsHeader: 'Updated History Book'
      };

      const response = await request(app)
        .put(`/api/salematerials/${testSaleMaterial.SaleMaterialId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.MaterialsHeader).toBe('Updated History Book');
    });

    test('should return 404 if sale material not found', async () => {
      const response = await request(app)
        .put('/api/salematerials/999')
        .send({ MaterialsHeader: 'Updated Book' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterial not found');
    });
  });

  describe('DELETE /api/salematerials/:id', () => {
    test('should delete a sale material and return status 204', async () => {
      const testSaleMaterial = await SaleMaterial.create({
        MaterialsHeader: 'Geography Book',
        Price: 100,
        VendorId: 6
      });

      const response = await request(app)
        .delete(`/api/salematerials/${testSaleMaterial.SaleMaterialId}`);

      expect(response.status).toBe(204);

      const deletedSaleMaterial = await SaleMaterial.findByPk(testSaleMaterial.SaleMaterialId);
      expect(deletedSaleMaterial).toBeNull();
    });

    test('should return 404 if sale material not found', async () => {
      const response = await request(app)
        .delete('/api/salematerials/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('SaleMaterial not found');
    });
  });
});