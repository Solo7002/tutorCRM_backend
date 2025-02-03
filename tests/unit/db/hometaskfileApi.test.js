const request = require('supertest');
const app = require('../../../src/app');
const { HomeTask, HomeTaskFile } = require('../../../src/models/dbModels');

describe('HomeTaskFile API Tests', () => {
  describe('POST /api/hometaskfiles', () => {
    test('should create a new home task file and return status 201', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Math Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      const newHomeTaskFile = {
        FileName: 'math_homework.pdf',
        FilePath: 'http://example.com/files/math_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      };

      const response = await request(app)
        .post('/api/hometaskfiles')
        .send(newHomeTaskFile);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('HometaskFileId');
      expect(response.body.FileName).toBe('math_homework.pdf');
      expect(response.body.FilePath).toBe('http://example.com/files/math_homework.pdf');
      expect(response.body.HomeTaskId).toBe(testHomeTask.HomeTaskId);
    });

    test('should return 400 for invalid input (missing FileName)', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Math Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      const invalidHomeTaskFile = {
        FilePath: 'http://example.com/files/math_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      };

      const response = await request(app)
        .post('/api/hometaskfiles')
        .send(invalidHomeTaskFile);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Validation error: FileName cannot be empty');
    });
  });

  describe('GET /api/hometaskfiles', () => {
    test('should return a list of home task files and status 200', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Science Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      await HomeTaskFile.create({
        FileName: 'science_homework.pdf',
        FilePath: 'http://example.com/files/science_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .get('/api/hometaskfiles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/hometaskfiles/:id', () => {
    test('should return a home task file by ID and status 200', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Chemistry Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      const testHomeTaskFile = await HomeTaskFile.create({
        FileName: 'chemistry_homework.pdf',
        FilePath: 'http://example.com/files/chemistry_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .get(`/api/hometaskfiles/${testHomeTaskFile.HometaskFileId}`);

      expect(response.status).toBe(200);
      expect(response.body.FileName).toBe('chemistry_homework.pdf');
      expect(response.body.FilePath).toBe('http://example.com/files/chemistry_homework.pdf');
      expect(response.body.HomeTaskId).toBe(testHomeTask.HomeTaskId);
    });

    test('should return 404 if home task file not found', async () => {
      const response = await request(app)
        .get('/api/hometaskfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HometaskFile not found');
    });
  });

  describe('GET /api/hometaskfiles/search', () => {
    test('should return matching home task files and status 200', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Biology Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      await HomeTaskFile.create({
        FileName: 'biology_homework.pdf',
        FilePath: 'http://example.com/files/biology_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .get('/api/hometaskfiles/search')
        .query({ fileName: 'biology' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].FileName).toContain('biology');
    });

    test('should return 404 if no home task files match the criteria', async () => {
      const response = await request(app)
        .get('/api/hometaskfiles/search')
        .query({ fileName: 'nonexistent' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No home task files found matching the criteria.');
    });
  });

  describe('PUT /api/hometaskfiles/:id', () => {
    test('should update a home task file and return status 200', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'History Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      const testHomeTaskFile = await HomeTaskFile.create({
        FileName: 'history_homework.pdf',
        FilePath: 'http://example.com/files/history_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const updatedData = {
        FileName: 'updated_history_homework.pdf'
      };

      const response = await request(app)
        .put(`/api/hometaskfiles/${testHomeTaskFile.HometaskFileId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.FileName).toBe('updated_history_homework.pdf');
    });

    test('should return 404 if home task file not found', async () => {
      const response = await request(app)
        .put('/api/hometaskfiles/999')
        .send({ FileName: 'updated_homework.pdf' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HometaskFile not found');
    });
  });

  describe('DELETE /api/hometaskfiles/:id', () => {
    test('should delete a home task file and return status 204', async () => {
      const testHomeTask = await HomeTask.create({
        HomeTaskHeader: 'Geography Homework',
        StartDate: new Date(),
        DeadlineDate: new Date(Date.now() + 86400000),
        GroupId: 1
      });

      const testHomeTaskFile = await HomeTaskFile.create({
        FileName: 'geography_homework.pdf',
        FilePath: 'http://example.com/files/geography_homework.pdf',
        HomeTaskId: testHomeTask.HomeTaskId
      });

      const response = await request(app)
        .delete(`/api/hometaskfiles/${testHomeTaskFile.HometaskFileId}`);

      expect(response.status).toBe(204);

      const deletedHomeTaskFile = await HomeTaskFile.findByPk(testHomeTaskFile.HometaskFileId);
      expect(deletedHomeTaskFile).toBeNull();
    });

    test('should return 404 if home task file not found', async () => {
      const response = await request(app)
        .delete('/api/hometaskfiles/999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('HometaskFile not found');
    });
  });
});