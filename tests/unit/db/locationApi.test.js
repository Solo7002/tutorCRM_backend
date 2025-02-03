const request = require('supertest');
const app = require('../../../src/app');
const { Location } = require('../../../src/models/dbModels');

describe('Location API Tests', () => {
  describe('POST /api/locations', () => {
    test('should create a new location and return status 201', async () => {
      const newLocation = {
        City: 'New York',
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/locations')
        .send(newLocation);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('LocationId');
      expect(response.body.City).toBe('New York');
      expect(response.body.Country).toBe('USA');
      expect(response.body.Latitude).toBe(40.7128);
      expect(response.body.Longitude).toBe(-74.006);
      expect(response.body.Address).toBe('123 Main St');
    });

    test('should return 400 for invalid input (missing City)', async () => {
      const invalidLocation = {
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: '123 Main St'
      };

      const response = await request(app)
        .post('/api/locations')
        .send(invalidLocation);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: City cannot be empty');
    });
  });

  describe('GET /api/locations', () => {
    test('should return a list of locations and status 200', async () => {
      await Location.create({
        City: 'Los Angeles',
        Country: 'USA',
        Latitude: 34.0522,
        Longitude: -118.2437,
        Address: '456 Elm St'
      });

      const response = await request(app)
        .get('/api/locations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/locations/:id', () => {
    test('should return a location by ID and status 200', async () => {
      const testLocation = await Location.create({
        City: 'Chicago',
        Country: 'USA',
        Latitude: 41.8781,
        Longitude: -87.6298,
        Address: '789 Oak St'
      });

      const response = await request(app)
        .get(`/api/locations/${testLocation.LocationId}`);

      expect(response.status).toBe(200);
      expect(response.body.City).toBe('Chicago');
      expect(response.body.Country).toBe('USA');
      expect(response.body.Latitude).toBe(41.8781);
      expect(response.body.Longitude).toBe(-87.6298);
      expect(response.body.Address).toBe('789 Oak St');
    });

    test('should return 404 if location not found', async () => {
      const response = await request(app)
        .get('/api/locations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Location not found');
    });
  });

  describe('GET /api/locations/search', () => {
    test('should return matching locations and status 200', async () => {
      await Location.create({
        City: 'San Francisco',
        Country: 'USA',
        Latitude: 37.7749,
        Longitude: -122.4194,
        Address: '321 Pine St'
      });

      const response = await request(app)
        .get('/api/locations/search')
        .query({ city: 'San' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].City).toContain('San');
    });

    test('should return 404 if no locations match the criteria', async () => {
      const response = await request(app)
        .get('/api/locations/search')
        .query({ city: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No locations found matching the criteria.');
    });
  });

  describe('PUT /api/locations/:id', () => {
    test('should update a location and return status 200', async () => {
      const testLocation = await Location.create({
        City: 'Miami',
        Country: 'USA',
        Latitude: 25.7617,
        Longitude: -80.1918,
        Address: '654 Palm St'
      });

      const updatedData = {
        City: 'Updated Miami'
      };

      const response = await request(app)
        .put(`/api/locations/${testLocation.LocationId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.City).toBe('Updated Miami');
    });

    test('should return 404 if location not found', async () => {
      const response = await request(app)
        .put('/api/locations/999')
        .send({ City: 'Updated City' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Location not found');
    });
  });

  describe('DELETE /api/locations/:id', () => {
    test('should delete a location and return status 204', async () => {
      const testLocation = await Location.create({
        City: 'Seattle',
        Country: 'USA',
        Latitude: 47.6062,
        Longitude: -122.3321,
        Address: '987 Maple St'
      });

      const response = await request(app)
        .delete(`/api/locations/${testLocation.LocationId}`);

      expect(response.status).toBe(204);

      const deletedLocation = await Location.findByPk(testLocation.LocationId);
      expect(deletedLocation).toBeNull();
    });

    test('should return 404 if location not found', async () => {
      const response = await request(app)
        .delete('/api/locations/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Location not found');
    });
  });
});