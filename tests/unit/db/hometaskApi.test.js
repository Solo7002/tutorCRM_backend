const request = require('supertest');
const app = require('../../../src/app');
const { Group, HomeTask } = require('../../../src/models/dbModels');

describe('HomeTask API Tests', () => {
  describe('POST /api/hometasks', () => {
    test('should create a new home task and return status 201', async () => {
      const testGroup = await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const newHomeTask = {
        HomeTaskHeader: 'Math Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      };

      const response = await request(app)
        .post('/api/hometasks')
        .send(newHomeTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('HomeTaskId');
      expect(response.body.HomeTaskHeader).toBe('Math Homework');
      expect(response.body.GroupId).toBe(testGroup.GroupId);
    });

    test('should return 400 for invalid input (missing HomeTaskHeader)', async () => {
      const testGroup = await Group.create({
        GroupName: 'Math Group',
        GroupPrice: 100,
        MaxStudents: 20
      });

      const invalidHomeTask = {
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      };

      const response = await request(app)
        .post('/api/hometasks')
        .send(invalidHomeTask);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: HomeTaskHeader cannot be empty');
    });
  });

  describe('GET /api/hometasks', () => {
    test('should return a list of home tasks and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Science Group',
        GroupPrice: 150,
        MaxStudents: 25
      });

      await HomeTask.create({
        HomeTaskHeader: 'Physics Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      });

      const response = await request(app)
        .get('/api/hometasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/hometasks/:id', () => {
    test('should return a home task by ID and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Chemistry Group',
        GroupPrice: 180,
        MaxStudents: 30
      });

      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Chemistry Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      });

      const response = await request(app)
        .get(`/api/hometasks/${testHomeTask.HomeTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.HomeTaskHeader).toBe('Chemistry Homework');
      expect(response.body.GroupId).toBe(testGroup.GroupId);
    });

    test('should return 404 if home task not found', async () => {
      const response = await request(app)
        .get('/api/hometasks/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HomeTask not found');
    });
  });

  describe('GET /api/hometasks/search', () => {
    test('should return matching home tasks and status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'Biology Group',
        GroupPrice: 200,
        MaxStudents: 22
      });

      await HomeTask.create({
        HomeTaskHeader: 'Biology Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      });

      const response = await request(app)
        .get('/api/hometasks/search')
        .query({ homeTaskHeader: 'Biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].HomeTaskHeader).toContain('Biology');
    });

    test('should return 404 if no home tasks match the criteria', async () => {
      const response = await request(app)
        .get('/api/hometasks/search')
        .query({ homeTaskHeader: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No home tasks found matching the criteria.');
    });
  });

  describe('PUT /api/hometasks/:id', () => {
    test('should update a home task and return status 200', async () => {
      const testGroup = await Group.create({
        GroupName: 'History Group',
        GroupPrice: 170,
        MaxStudents: 28
      });

      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'History Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      });

      const updatedData = {
        HomeTaskHeader: 'Updated History Homework'
      };

      const response = await request(app)
        .put(`/api/hometasks/${testHomeTask.HomeTaskId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.HomeTaskHeader).toBe('Updated History Homework');
    });

    test('should return 404 if home task not found', async () => {
      const response = await request(app)
        .put('/api/hometasks/999')
        .send({ HomeTaskHeader: 'Updated Homework' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HomeTask not found');
    });
  });

  describe('DELETE /api/hometasks/:id', () => {
    test('should delete a home task and return status 204', async () => {
      const testGroup = await Group.create({
        GroupName: 'Geography Group',
        GroupPrice: 190,
        MaxStudents: 24
      });

      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Geography Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: testGroup.GroupId
      });

      const response = await request(app)
        .delete(`/api/hometasks/${testHomeTask.HomeTaskId}`);

      expect(response.status).toBe(204);

      const deletedHomeTask = await HomeTask.findByPk(testHomeTask.HomeTaskId);
      expect(deletedHomeTask).toBeNull();
    });

    test('should return 404 if home task not found', async () => {
      const response = await request(app)
        .delete('/api/hometasks/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HomeTask not found');
    });
  });
});