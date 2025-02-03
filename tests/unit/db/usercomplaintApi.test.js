const request = require('supertest');
const app = require('../../../src/app');
const { UserComplaint } = require('../../../src/models/dbModels');

describe('UserComplaint API Tests', () => {
  describe('POST /api/usercomplaints', () => {
    test('should create a new user complaint and return status 201', async () => {
      const newUserComplaint = {
        ComplaintDate: new Date(),
        ComplaintDescription: 'This is a test complaint.'
      };

      const response = await request(app)
        .post('/api/usercomplaints')
        .send(newUserComplaint);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('UserComplaintId');
      expect(new Date(response.body.ComplaintDate)).toBeInstanceOf(Date);
      expect(response.body.ComplaintDescription).toBe('This is a test complaint.');
    });

    test('should return 400 for invalid input (missing ComplaintDescription)', async () => {
      const invalidUserComplaint = {
        ComplaintDate: new Date()
      };

      const response = await request(app)
        .post('/api/usercomplaints')
        .send(invalidUserComplaint);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: ComplaintDescription cannot be empty');
    });
  });

  describe('GET /api/usercomplaints', () => {
    test('should return a list of user complaints and status 200', async () => {
      await UserComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Another test complaint.'
      });

      const response = await request(app)
        .get('/api/usercomplaints');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/usercomplaints/:id', () => {
    test('should return a user complaint by ID and status 200', async () => {
      const userComplaint = await UserComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Test complaint for GET.'
      });

      const response = await request(app)
        .get(`/api/usercomplaints/${userComplaint.UserComplaintId}`);

      expect(response.status).toBe(200);
      expect(new Date(response.body.ComplaintDate)).toBeInstanceOf(Date);
      expect(response.body.ComplaintDescription).toBe('Test complaint for GET.');
    });

    test('should return 404 if user complaint not found', async () => {
      const response = await request(app)
        .get('/api/usercomplaints/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserComplaint not found');
    });
  });

  describe('GET /api/usercomplaints/search', () => {
    test('should return matching user complaints and status 200', async () => {
      await UserComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Searchable complaint.'
      });

      const response = await request(app)
        .get('/api/usercomplaints/search')
        .query({ description: 'Searchable' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].ComplaintDescription).toContain('Searchable');
    });

    test('should return 404 if no user complaints match the criteria', async () => {
      const response = await request(app)
        .get('/api/usercomplaints/search')
        .query({ description: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No user complaints found matching the criteria.');
    });
  });

  describe('PUT /api/usercomplaints/:id', () => {
    test('should update a user complaint and return status 200', async () => {
      const userComplaint = await UserComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Original complaint.'
      });

      const updatedData = {
        ComplaintDescription: 'Updated complaint.'
      };

      const response = await request(app)
        .put(`/api/usercomplaints/${userComplaint.UserComplaintId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.ComplaintDescription).toBe('Updated complaint.');
    });

    test('should return 404 if user complaint not found', async () => {
      const response = await request(app)
        .put('/api/usercomplaints/999')
        .send({ ComplaintDescription: 'Updated complaint.' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserComplaint not found');
    });
  });

  describe('DELETE /api/usercomplaints/:id', () => {
    test('should delete a user complaint and return status 204', async () => {
      const userComplaint = await UserComplaint.create({
        ComplaintDate: new Date(),
        ComplaintDescription: 'Complaint to delete.'
      });

      const response = await request(app)
        .delete(`/api/usercomplaints/${userComplaint.UserComplaintId}`);

      expect(response.status).toBe(204);

      const deletedUserComplaint = await UserComplaint.findByPk(userComplaint.UserComplaintId);
      expect(deletedUserComplaint).toBeNull();
    });

    test('should return 404 if user complaint not found', async () => {
      const response = await request(app)
        .delete('/api/usercomplaints/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('UserComplaint not found');
    });
  });
});