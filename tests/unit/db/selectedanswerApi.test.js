const httpMocks = require('node-mocks-http');
const { SelectedAnswer } = require('../../../src/models/dbModels');
const selectedAnswerController = require('../../../src/controllers/dbControllers/selectedAnswerController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  SelectedAnswer: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('SelectedAnswer Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createSelectedAnswer should create a new selected answer', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        TestQuestionId: 1,
        DoneTestId: 1,
      },
    });
    const res = httpMocks.createResponse();

    SelectedAnswer.create.mockResolvedValue(req.body);

    await selectedAnswerController.createSelectedAnswer(req, res);

    expect(SelectedAnswer.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getSelectedAnswers should return all selected answers', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockSelectedAnswers = [
      {
        SelectedAnswerId: 1,
        TestQuestionId: 1,
        DoneTestId: 1,
      },
    ];

    SelectedAnswer.findAll.mockResolvedValue(mockSelectedAnswers);

    await selectedAnswerController.getSelectedAnswers(req, res);

    expect(SelectedAnswer.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSelectedAnswers);
  });

  test('getSelectedAnswerById should return selected answer if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSelectedAnswer = {
      SelectedAnswerId: 1,
      TestQuestionId: 1,
      DoneTestId: 1,
    };

    SelectedAnswer.findByPk.mockResolvedValue(mockSelectedAnswer);

    await selectedAnswerController.getSelectedAnswerById(req, res);

    expect(SelectedAnswer.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSelectedAnswer);
  });

  test('searchSelectedAnswers should return matching selected answers', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        testQuestionId: '1',
        doneTestId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockSelectedAnswers = [
      {
        SelectedAnswerId: 1,
        TestQuestionId: 1,
        DoneTestId: 1,
      },
    ];

    SelectedAnswer.findAll.mockResolvedValue(mockSelectedAnswers);

    await selectedAnswerController.searchSelectedAnswers(req, res);

    expect(SelectedAnswer.findAll).toHaveBeenCalledWith({
      where: {
        TestQuestionId: '1',
        DoneTestId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockSelectedAnswers);
  });

  test('updateSelectedAnswer should update an existing selected answer', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { TestQuestionId: 2 },
    });
    const res = httpMocks.createResponse();

    const mockSelectedAnswer = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        SelectedAnswerId: 1,
        TestQuestionId: 2,
        DoneTestId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockSelectedAnswer.dataValues })),
    };

    SelectedAnswer.findByPk.mockResolvedValue(mockSelectedAnswer);

    await selectedAnswerController.updateSelectedAnswer(req, res);

    expect(mockSelectedAnswer.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      SelectedAnswerId: 1,
      TestQuestionId: 2,
      DoneTestId: 1,
    });
    expect(mockSelectedAnswer.toJSON).toHaveBeenCalled();
  });

  test('deleteSelectedAnswer should remove a selected answer', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSelectedAnswer = { destroy: jest.fn().mockResolvedValue(1) };

    SelectedAnswer.findByPk.mockResolvedValue(mockSelectedAnswer);

    await selectedAnswerController.deleteSelectedAnswer(req, res);

    expect(mockSelectedAnswer.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getSelectedAnswerById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    SelectedAnswer.findByPk.mockResolvedValue(null);

    await selectedAnswerController.getSelectedAnswerById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'SelectedAnswer not found' });
  });

  test('searchSelectedAnswers should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { testQuestionId: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    SelectedAnswer.findAll.mockResolvedValue([]);

    await selectedAnswerController.searchSelectedAnswers(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No selected answers found.' });
  });
});