const request = require('supertest');
const app = require('../../../src/app');
const { PurchasedMaterial } = require('../../../src/models/dbModels');

describe('PurchasedMaterial API Tests', () => {
  describe('POST /api/purchasedmaterials', () => {
    test('should create a new purchased material and return status 201', async () => {
      const newPurchasedMaterial = {
        SaleMaterialId: 1,
        PurchaserId: 1,
        PurchasedDate: new Date()
      };

      const response = await request(app)
        .post('/api/purchasedmaterials')
        .send(newPurchasedMaterial);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('PurchasedMaterialId');
      expect(response.body.SaleMaterialId).toBe(1);
      expect(response.body.PurchaserId).toBe(1);
      expect(new Date(response.body.PurchasedDate)).toBeInstanceOf(Date);
    });

    test('should return 400 for invalid input (missing SaleMaterialId)', async () => {
      const invalidPurchasedMaterial = {
        PurchaserId: 1,
        PurchasedDate: new Date()
      };

      const response = await request(app)
        .post('/api/purchasedmaterials')
        .send(invalidPurchasedMaterial);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: SaleMaterialId cannot be null');
    });
  });

  describe('GET /api/purchasedmaterials', () => {
    test('should return a list of purchased materials and status 200', async () => {
      await PurchasedMaterial.create({
        SaleMaterialId: 2,
        PurchaserId: 2,
        PurchasedDate: new Date()
      });

      const response = await request(app)
        .get('/api/purchasedmaterials');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/purchasedmaterials/:id', () => {
    test('should return a purchased material by ID and status 200', async () => {
      const testPurchasedMaterial = await PurchasedMaterial.create({
        SaleMaterialId: 3,
        PurchaserId: 3,
        PurchasedDate: new Date()
      });

      const response = await request(app)
        .get(`/api/purchasedmaterials/${testPurchasedMaterial.PurchasedMaterialId}`);

      expect(response.status).toBe(200);
      expect(response.body.SaleMaterialId).toBe(3);
      expect(response.body.PurchaserId).toBe(3);
      expect(new Date(response.body.PurchasedDate)).toBeInstanceOf(Date);
    });

    test('should return 404 if purchased material not found', async () => {
      const response = await request(app)
        .get('/api/purchasedmaterials/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PurchasedMaterial not found');
    });
  });

  describe('GET /api/purchasedmaterials/search', () => {
    test('should return matching purchased materials and status 200', async () => {
      await PurchasedMaterial.create({
        SaleMaterialId: 4,
        PurchaserId: 4,
        PurchasedDate: new Date()
      });

      const response = await request(app)
        .get('/api/purchasedmaterials/search')
        .query({ purchaserId: 4 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].PurchaserId).toBe(4);
    });

    test('should return 404 if no purchased materials match the criteria', async () => {
      const response = await request(app)
        .get('/api/purchasedmaterials/search')
        .query({ purchaserId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No purchased materials found matching the criteria.');
    });
  });

  describe('PUT /api/purchasedmaterials/:id', () => {
    test('should update a purchased material and return status 200', async () => {
      const testPurchasedMaterial = await PurchasedMaterial.create({
        SaleMaterialId: 5,
        PurchaserId: 5,
        PurchasedDate: new Date()
      });

      const updatedData = {
        SaleMaterialId: 6
      };

      const response = await request(app)
        .put(`/api/purchasedmaterials/${testPurchasedMaterial.PurchasedMaterialId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.SaleMaterialId).toBe(6);
    });

    test('should return 404 if purchased material not found', async () => {
      const response = await request(app)
        .put('/api/purchasedmaterials/999')
        .send({ SaleMaterialId: 7 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PurchasedMaterial not found');
    });
  });

  describe('DELETE /api/purchasedmaterials/:id', () => {
    test('should delete a purchased material and return status 204', async () => {
      const testPurchasedMaterial = await PurchasedMaterial.create({
        SaleMaterialId: 8,
        PurchaserId: 8,
        PurchasedDate: new Date()
      });

      const response = await request(app)
        .delete(`/api/purchasedmaterials/${testPurchasedMaterial.PurchasedMaterialId}`);

      expect(response.status).toBe(204);

      const deletedPurchasedMaterial = await PurchasedMaterial.findByPk(testPurchasedMaterial.PurchasedMaterialId);
      expect(deletedPurchasedMaterial).toBeNull();
    });

    test('should return 404 if purchased material not found', async () => {
      const response = await request(app)
        .delete('/api/purchasedmaterials/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('PurchasedMaterial not found');
    });
  });
});