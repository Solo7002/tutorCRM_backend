const httpMocks = require('node-mocks-http');
const { TestAnswer } = require('../../../src/models/dbModels');
const testAnswerController = require('../../../src/controllers/dbControllers/testAnswerController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  TestAnswer: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('TestAnswer Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTestAnswer should create a new test answer', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        AnswerText: 'Correct answer',
        ImagePath: 'http://example.com/image.jpg',
        IsRightAnswer: true,
      },
    });
    const res = httpMocks.createResponse();

    TestAnswer.create.mockResolvedValue(req.body);

    await testAnswerController.createTestAnswer(req, res);

    expect(TestAnswer.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getTestAnswers should return all test answers', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockTestAnswers = [
      {
        TestAnswerId: 1,
        AnswerText: 'Correct answer',
        ImagePath: 'http://example.com/image.jpg',
        IsRightAnswer: true,
      },
      {
        TestAnswerId: 2,
        AnswerText: 'Incorrect answer',
        ImagePath: null,
        IsRightAnswer: false,
      },
    ];

    TestAnswer.findAll.mockResolvedValue(mockTestAnswers);

    await testAnswerController.getTestAnswers(req, res);

    expect(TestAnswer.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTestAnswers);
  });

  test('getTestAnswerById should return test answer if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTestAnswer = {
      TestAnswerId: 1,
      AnswerText: 'Correct answer',
      ImagePath: 'http://example.com/image.jpg',
      IsRightAnswer: true,
    };

    TestAnswer.findByPk.mockResolvedValue(mockTestAnswer);

    await testAnswerController.getTestAnswerById(req, res);

    expect(TestAnswer.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTestAnswer);
  });

  test('searchTestAnswers should return matching test answers', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        answerText: 'Correct',
        isRightAnswer: 'true',
      },
    });
    const res = httpMocks.createResponse();

    const mockTestAnswers = [
      {
        TestAnswerId: 1,
        AnswerText: 'Correct answer',
        ImagePath: 'http://example.com/image.jpg',
        IsRightAnswer: true,
      },
    ];

    TestAnswer.findAll.mockResolvedValue(mockTestAnswers);

    await testAnswerController.searchTestAnswers(req, res);

    expect(TestAnswer.findAll).toHaveBeenCalledWith({
      where: {
        AnswerText: { [Op.like]: '%Correct%' },
        IsRightAnswer: true,
      },
      attributes: ['TestAnswerId', 'AnswerText', 'ImagePath', 'IsRightAnswer'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTestAnswers);
  });

  test('updateTestAnswer should update an existing test answer', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { AnswerText: 'Updated answer' },
    });
    const res = httpMocks.createResponse();

    const mockTestAnswer = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        TestAnswerId: 1,
        AnswerText: 'Updated answer',
        ImagePath: 'http://example.com/image.jpg',
        IsRightAnswer: true,
      },
      toJSON: jest.fn(() => ({ ...mockTestAnswer.dataValues })),
    };

    TestAnswer.findByPk.mockResolvedValue(mockTestAnswer);

    await testAnswerController.updateTestAnswer(req, res);

    expect(mockTestAnswer.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      TestAnswerId: 1,
      AnswerText: 'Updated answer',
      ImagePath: 'http://example.com/image.jpg',
      IsRightAnswer: true,
    });
    expect(mockTestAnswer.toJSON).toHaveBeenCalled();
  });

  test('deleteTestAnswer should remove a test answer', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTestAnswer = { destroy: jest.fn().mockResolvedValue(1) };

    TestAnswer.findByPk.mockResolvedValue(mockTestAnswer);

    await testAnswerController.deleteTestAnswer(req, res);

    expect(mockTestAnswer.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getTestAnswerById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    TestAnswer.findByPk.mockResolvedValue(null);

    await testAnswerController.getTestAnswerById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'TestAnswer not found' });
  });

  test('searchTestAnswers should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { answerText: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    TestAnswer.findAll.mockResolvedValue([]);

    await testAnswerController.searchTestAnswers(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No test answers found matching the criteria.' });
  });
});