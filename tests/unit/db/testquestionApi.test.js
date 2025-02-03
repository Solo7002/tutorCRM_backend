const httpMocks = require('node-mocks-http');
const { TestQuestion } = require('../../../src/models/dbModels');
const testQuestionController = require('../../../src/controllers/dbControllers/testQuestionController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  TestQuestion: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('TestQuestion Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTestQuestion should create a new test question', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        TestQuestionHeader: 'Math Question',
        TestQuestionDescription: 'Solve this math problem',
        ImagePath: 'http://example.com/image.jpg',
        AudioPath: 'http://example.com/audio.mp3',
      },
    });
    const res = httpMocks.createResponse();

    TestQuestion.create.mockResolvedValue(req.body);

    await testQuestionController.createTestQuestion(req, res);

    expect(TestQuestion.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getTestQuestions should return all test questions', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockTestQuestions = [
      {
        TestQuestionId: 1,
        TestQuestionHeader: 'Math Question',
        TestQuestionDescription: 'Solve this math problem',
        ImagePath: 'http://example.com/image.jpg',
        AudioPath: 'http://example.com/audio.mp3',
      },
      {
        TestQuestionId: 2,
        TestQuestionHeader: 'Physics Question',
        TestQuestionDescription: 'Explain this physics concept',
        ImagePath: null,
        AudioPath: null,
      },
    ];

    TestQuestion.findAll.mockResolvedValue(mockTestQuestions);

    await testQuestionController.getTestQuestions(req, res);

    expect(TestQuestion.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTestQuestions);
  });

  test('getTestQuestionById should return test question if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTestQuestion = {
      TestQuestionId: 1,
      TestQuestionHeader: 'Math Question',
      TestQuestionDescription: 'Solve this math problem',
      ImagePath: 'http://example.com/image.jpg',
      AudioPath: 'http://example.com/audio.mp3',
    };

    TestQuestion.findByPk.mockResolvedValue(mockTestQuestion);

    await testQuestionController.getTestQuestionById(req, res);

    expect(TestQuestion.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTestQuestion);
  });

  test('searchTestQuestions should return matching test questions', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        header: 'Math',
        description: 'problem',
      },
    });
    const res = httpMocks.createResponse();

    const mockTestQuestions = [
      {
        TestQuestionId: 1,
        TestQuestionHeader: 'Math Question',
        TestQuestionDescription: 'Solve this math problem',
        ImagePath: 'http://example.com/image.jpg',
        AudioPath: 'http://example.com/audio.mp3',
      },
    ];

    TestQuestion.findAll.mockResolvedValue(mockTestQuestions);

    await testQuestionController.searchTestQuestions(req, res);

    expect(TestQuestion.findAll).toHaveBeenCalledWith({
      where: {
        TestQuestionHeader: { [Op.like]: '%Math%' },
        TestQuestionDescription: { [Op.like]: '%problem%' },
      },
      attributes: ['TestQuestionId', 'TestQuestionHeader', 'TestQuestionDescription', 'ImagePath', 'AudioPath'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTestQuestions);
  });

  test('updateTestQuestion should update an existing test question', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { TestQuestionHeader: 'Updated Math Question' },
    });
    const res = httpMocks.createResponse();

    const mockTestQuestion = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        TestQuestionId: 1,
        TestQuestionHeader: 'Updated Math Question',
        TestQuestionDescription: 'Solve this math problem',
        ImagePath: 'http://example.com/image.jpg',
        AudioPath: 'http://example.com/audio.mp3',
      },
      toJSON: jest.fn(() => ({ ...mockTestQuestion.dataValues })),
    };

    TestQuestion.findByPk.mockResolvedValue(mockTestQuestion);

    await testQuestionController.updateTestQuestion(req, res);

    expect(mockTestQuestion.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      TestQuestionId: 1,
      TestQuestionHeader: 'Updated Math Question',
      TestQuestionDescription: 'Solve this math problem',
      ImagePath: 'http://example.com/image.jpg',
      AudioPath: 'http://example.com/audio.mp3',
    });
    expect(mockTestQuestion.toJSON).toHaveBeenCalled();
  });

  test('deleteTestQuestion should remove a test question', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTestQuestion = { destroy: jest.fn().mockResolvedValue(1) };

    TestQuestion.findByPk.mockResolvedValue(mockTestQuestion);

    await testQuestionController.deleteTestQuestion(req, res);

    expect(mockTestQuestion.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getTestQuestionById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    TestQuestion.findByPk.mockResolvedValue(null);

    await testQuestionController.getTestQuestionById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'TestQuestion not found' });
  });

  test('searchTestQuestions should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { header: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    TestQuestion.findAll.mockResolvedValue([]);

    await testQuestionController.searchTestQuestions(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No test questions found matching the criteria.' });
  });
});