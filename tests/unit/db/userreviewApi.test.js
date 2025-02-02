const request = require('supertest');
const app = require('../../../src/app');
const { UserReview } = require('../../../src/models/dbModels');

describe('UserReview API Tests', () => {
  describe('POST /api/userreviews', () => {
    test('should create a new user review and return status 201', async () => {
      const newUserReview = {
        ReviewHeader: 'Great Service',
        ReviewText: 'The service was excellent!',
        CreateDate: new Date()
      };

      const response = await request(app)
        .post('/api/userreviews')
        .send(newUserReview);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('UserReviewId');
      expect(response.body.ReviewHeader).toBe('Great Service');
      expect(response.body.ReviewText).toBe('The service was excellent!');
      expect(new Date(response.body.CreateDate)).toBeInstanceOf(Date);
    });

    test('should return 400 for invalid input (missing ReviewHeader)', async () => {
      const invalidUserReview = {
        ReviewText: 'The service was excellent!',
        CreateDate: new Date()
      };

      const response = await request(app)
        .post('/api/userreviews')
        .send(invalidUserReview);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: ReviewHeader cannot be empty');
    });
  });

  describe('GET /api/userreviews', () => {
    test('should return a list of user reviews and status 200', async () => {
      await UserReview.create({
        ReviewHeader: 'Good Experience',
        ReviewText: 'I had a good experience.',
        CreateDate: new Date()
      });

      const response = await request(app)
        .get('/api/userreviews');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/userreviews/:id', () => {
    test('should return a user review by ID and status 200', async () => {
      const userReview = await UserReview.create({
        ReviewHeader: 'Excellent Product',
        ReviewText: 'The product is amazing.',
        CreateDate: new Date()
      });

      const response = await request(app)
        .get(`/api/userreviews/${userReview.UserReviewId}`);

      expect(response.status).toBe(200);
      expect(response.body.ReviewHeader).toBe('Excellent Product');
      expect(response.body.ReviewText).toBe('The product is amazing.');
      expect(new Date(response.body.CreateDate)).toBeInstanceOf(Date);
    });

    test('should return 404 if user review not found', async () => {
      const response = await request(app)
        .get('/api/userreviews/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserReview not found');
    });
  });

  describe('GET /api/userreviews/search', () => {
    test('should return matching user reviews and status 200', async () => {
      await UserReview.create({
        ReviewHeader: 'Searchable Header',
        ReviewText: 'This is a searchable review.',
        CreateDate: new Date()
      });

      const response = await request(app)
        .get('/api/userreviews/search')
        .query({ reviewHeader: 'Searchable' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].ReviewHeader).toContain('Searchable');
    });

    test('should return 404 if no user reviews match the criteria', async () => {
      const response = await request(app)
        .get('/api/userreviews/search')
        .query({ reviewHeader: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No user reviews found matching the criteria.');
    });
  });

  describe('PUT /api/userreviews/:id', () => {
    test('should update a user review and return status 200', async () => {
      const userReview = await UserReview.create({
        ReviewHeader: 'Old Header',
        ReviewText: 'Old review text.',
        CreateDate: new Date()
      });

      const updatedData = {
        ReviewHeader: 'Updated Header'
      };

      const response = await request(app)
        .put(`/api/userreviews/${userReview.UserReviewId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.ReviewHeader).toBe('Updated Header');
    });

    test('should return 404 if user review not found', async () => {
      const response = await request(app)
        .put('/api/userreviews/999')
        .send({ ReviewHeader: 'Updated Header' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserReview not found');
    });
  });

  describe('DELETE /api/userreviews/:id', () => {
    test('should delete a user review and return status 204', async () => {
      const userReview = await UserReview.create({
        ReviewHeader: 'To Delete',
        ReviewText: 'This review will be deleted.',
        CreateDate: new Date()
      });

      const response = await request(app)
        .delete(`/api/userreviews/${userReview.UserReviewId}`);

      expect(response.status).toBe(204);

      const deletedUserReview = await UserReview.findByPk(userReview.UserReviewId);
      expect(deletedUserReview).toBeNull();
    });

    test('should return 404 if user review not found', async () => {
      const response = await request(app)
        .delete('/api/userreviews/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserReview not found');
    });
  });
});