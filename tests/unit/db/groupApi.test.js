const request = require('supertest');
const app = require('../../../src/app');
const { Group, GroupStudent, Student } = require('../../../src/models/dbModels');

describe('Group API Tests', () => {
  describe('POST /api/groups', () => {
    test('should create a new group and return status 201', async () => {
      const newGroup = {
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      };

      const response = await request(app)
        .post('/api/groups')
        .send(newGroup);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('GroupId');
      expect(response.body.GroupName).toBe('Math Group');
      expect(response.body.GroupPrice).toBe(100);
      expect(response.body.MaxStudents).toBe(20);
    });

    test('should return 400 for invalid input (missing GroupName)', async () => {
      const invalidGroup = {
        GroupPrice: 100,
        MaxStudents: 20
      };

      const response = await request(app)
        .post('/api/groups')
        .send(invalidGroup);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: GroupName cannot be empty');
    });
  });

  describe('GET /api/groups', () => {
    test('should return a list of groups and status 200', async () => {
      await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const response = await request(app)
        .get('/api/groups');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/groups/:id', () => {
    test('should return a group by ID and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Science Group',
        GroupPrice: 150,
        MaxStudents: 25
      });

      const response = await request(app)
        .get(`/api/groups/${testGroup.GroupId}`);

      expect(response.status).toBe(200);
      expect(response.body.GroupName).toBe('Science Group');
      expect(response.body.GroupPrice).toBe(150);
      expect(response.body.MaxStudents).toBe(25);
    });

    test('should return 404 if group not found', async () => {
      const response = await request(app)
        .get('/api/groups/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });

  describe('GET /api/groups/search', () => {
    test('should return matching groups and status 200', async () => {
      await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const response = await request(app)
        .get('/api/groups/search')
        .query({ groupName: 'Math' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].GroupName).toContain('Math');
    });

    test('should return 404 if no groups match the criteria', async () => {
      const response = await request(app)
        .get('/api/groups/search')
        .query({ groupName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No groups found matching the criteria.');
    });
  });

  describe('PUT /api/groups/:id', () => {
    test('should update a group and return status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Physics Group',
        GroupPrice: 200,
        MaxStudents: 30
      });

      const updatedData = {
        GroupName: 'Updated Physics Group',
        GroupPrice: 250
      };

      const response = await request(app)
        .put(`/api/groups/${testGroup.GroupId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.GroupName).toBe('Updated Physics Group');
      expect(response.body.GroupPrice).toBe(250);
    });

    test('should return 404 if group not found', async () => {
      const response = await request(app)
        .put('/api/groups/999')
        .send({ GroupName: 'Updated Group' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });

  describe('DELETE /api/groups/:id', () => {
    test('should delete a group and return status 204', async () => {
      const testGroup = await Group.create({
        GroupName: 'Chemistry Group',
        GroupPrice: 180,
        MaxStudents: 25
      });

      const response = await request(app)
        .delete(`/api/groups/${testGroup.GroupId}`);

      expect(response.status).toBe(204);

      const deletedGroup = await Group.findByPk(testGroup.GroupId);
      expect(deletedGroup).toBeNull();
    });

    test('should return 404 if group not found', async () => {
      const response = await request(app)
        .delete('/api/groups/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Group not found');
    });
  });
});