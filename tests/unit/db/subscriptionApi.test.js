const request = require('supertest');
const app = require('../../../src/app');
const { Subscription } = require('../../../src/models/dbModels');

describe('Subscription API Tests', () => {
  describe('POST /api/subscriptions', () => {
    test('should create a new subscription and return status 201', async () => {
      const newSubscription = {
        SubscriptionName: 'Basic Plan',
        SubscriptionPrice: 10.99
      };

      const response = await request(app)
        .post('/api/subscriptions')
        .send(newSubscription);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('SubscriptionId');
      expect(response.body.SubscriptionName).toBe('Basic Plan');
      expect(response.body.SubscriptionPrice).toBe(10.99);
    });

    test('should return 400 for invalid input (missing SubscriptionName)', async () => {
      const invalidSubscription = {
        SubscriptionPrice: 10.99
      };

      const response = await request(app)
        .post('/api/subscriptions')
        .send(invalidSubscription);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: SubscriptionName cannot be empty');
    });
  });

  describe('GET /api/subscriptions', () => {
    test('should return a list of subscriptions and status 200', async () => {
      await Subscription.create({
        SubscriptionName: 'Premium Plan',
        SubscriptionPrice: 20.99
      });

      const response = await request(app)
        .get('/api/subscriptions');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/subscriptions/:id', () => {
    test('should return a subscription by ID and status 200', async () => {
      const testSubscription = await Subscription.create({
        SubscriptionName: 'Standard Plan',
        SubscriptionPrice: 15.99
      });

      const response = await request(app)
        .get(`/api/subscriptions/${testSubscription.SubscriptionId}`);

      expect(response.status).toBe(200);
      expect(response.body.SubscriptionName).toBe('Standard Plan');
      expect(response.body.SubscriptionPrice).toBe(15.99);
    });

    test('should return 404 if subscription not found', async () => {
      const response = await request(app)
        .get('/api/subscriptions/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });
  });

  describe('GET /api/subscriptions/search', () => {
    test('should return matching subscriptions and status 200', async () => {
      await Subscription.create({
        SubscriptionName: 'Gold Plan',
        SubscriptionPrice: 30.99
      });

      const response = await request(app)
        .get('/api/subscriptions/search')
        .query({ subscriptionName: 'Gold' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].SubscriptionName).toContain('Gold');
    });

    test('should return 404 if no subscriptions match the criteria', async () => {
      const response = await request(app)
        .get('/api/subscriptions/search')
        .query({ subscriptionName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No subscriptions found.');
    });
  });

  describe('PUT /api/subscriptions/:id', () => {
    test('should update a subscription and return status 200', async () => {
      const testSubscription = await Subscription.create({
        SubscriptionName: 'Silver Plan',
        SubscriptionPrice: 25.99
      });

      const updatedData = {
        SubscriptionName: 'Updated Silver Plan'
      };

      const response = await request(app)
        .put(`/api/subscriptions/${testSubscription.SubscriptionId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.SubscriptionName).toBe('Updated Silver Plan');
    });

    test('should return 404 if subscription not found', async () => {
      const response = await request(app)
        .put('/api/subscriptions/999')
        .send({ SubscriptionName: 'Updated Plan' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });
  });

  describe('DELETE /api/subscriptions/:id', () => {
    test('should delete a subscription and return status 200', async () => {
      const testSubscription = await Subscription.create({
        SubscriptionName: 'Bronze Plan',
        SubscriptionPrice: 5.99
      });

      const response = await request(app)
        .delete(`/api/subscriptions/${testSubscription.SubscriptionId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Subscription deleted successfully');

      const deletedSubscription = await Subscription.findByPk(testSubscription.SubscriptionId);
      expect(deletedSubscription).toBeNull();
    });

    test('should return 404 if subscription not found', async () => {
      const response = await request(app)
        .delete('/api/subscriptions/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Subscription not found');
    });
  });
});