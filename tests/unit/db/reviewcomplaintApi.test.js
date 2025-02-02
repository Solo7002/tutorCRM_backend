const request = require('supertest');
const app = require('../../../src/app');
const { ReviewComplaint } = require('../../../src/models/dbModels');

describe('ReviewComplaint API Tests', () => {
  describe('POST /api/reviewcomplaints', () => {
    test('should create a new review complaint and return status 201', async () => {
      const newReviewComplaint = {
        ComplaintDate: new Date(),
        ComplaintDescription: 'This is a test complaint',
        UserFromId: 1,
        ReviewId: 1
      };

      const response = await request(app)
        .post('/api/reviewcomplaints')
        .send(newReviewComplaint);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('ReviewComplaintId');
      expect(new Date(response.body.ComplaintDate)).toBeInstanceOf(Date);
      expect(response.body.ComplaintDescription).toBe('This is a test complaint');
      expect(response.body.UserFromId).toBe(1);
      expect(response.body.ReviewId).toBe(1);
    });

    test('should return 400 for invalid input (missing ComplaintDescription)', async () => {
      const invalidReviewComplaint = {
        ComplaintDate: new Date(),
        UserFromId: 1,
        ReviewId: 1
      };

      const response = await request(app)
        .post('/api/reviewcomplaints')
        .send(invalidReviewComplaint);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: ComplaintDescription cannot be empty');
    });
  });

  describe('GET /api/reviewcomplaints', () => {
    test('should return a list of review complaints and status 200', async () => {
      await ReviewComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Another test complaint',
        UserFromId: 2,
        ReviewId: 2
      });

      const response = await request(app)
        .get('/api/reviewcomplaints');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/reviewcomplaints/:id', () => {
    test('should return a review complaint by ID and status 200', async () => {
      const testReviewComplaint = await ReviewComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Test complaint for GET by ID',
        UserFromId: 3,
        ReviewId: 3
      });

      const response = await request(app)
        .get(`/api/reviewcomplaints/${testReviewComplaint.ReviewComplaintId}`);

      expect(response.status).toBe(200);
      expect(response.body.ComplaintDescription).toBe('Test complaint for GET by ID');
      expect(response.body.UserFromId).toBe(3);
      expect(response.body.ReviewId).toBe(3);
    });

    test('should return 404 if review complaint not found', async () => {
      const response = await request(app)
        .get('/api/reviewcomplaints/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('ReviewComplaint not found');
    });
  });

  describe('GET /api/reviewcomplaints/search', () => {
    test('should return matching review complaints and status 200', async () => {
      await ReviewComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Searchable complaint',
        UserFromId: 4,
        ReviewId: 4
      });

      const response = await request(app)
        .get('/api/reviewcomplaints/search')
        .query({ userFromId: 4 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].UserFromId).toBe(4);
    });

    test('should return 404 if no review complaints match the criteria', async () => {
      const response = await request(app)
        .get('/api/reviewcomplaints/search')
        .query({ userFromId: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No review complaints found matching the criteria.');
    });
  });

  describe('PUT /api/reviewcomplaints/:id', () => {
    test('should update a review complaint and return status 200', async () => {
      const testReviewComplaint = await ReviewComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Original description',
        UserFromId: 5,
        ReviewId: 5
      });

      const updatedData = {
        ComplaintDescription: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/reviewcomplaints/${testReviewComplaint.ReviewComplaintId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.ComplaintDescription).toBe('Updated description');
    });

    test('should return 404 if review complaint not found', async () => {
      const response = await request(app)
        .put('/api/reviewcomplaints/999')
        .send({ ComplaintDescription: 'Updated description' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('ReviewComplaint not found');
    });
  });

  describe('DELETE /api/reviewcomplaints/:id', () => {
    test('should delete a review complaint and return status 204', async () => {
      const testReviewComplaint = await ReviewComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Complaint to delete',
        UserFromId: 6,
        ReviewId: 6
      });

      const response = await request(app)
        .delete(`/api/reviewcomplaints/${testReviewComplaint.ReviewComplaintId}`);

      expect(response.status).toBe(204);

      const deletedReviewComplaint = await ReviewComplaint.findByPk(testReviewComplaint.ReviewComplaintId);
      expect(deletedReviewComplaint).toBeNull();
    });

    test('should return 404 if review complaint not found', async () => {
      const response = await request(app)
        .delete('/api/reviewcomplaints/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('ReviewComplaint not found');
    });
  });
});