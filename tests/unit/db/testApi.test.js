const httpMocks = require('node-mocks-http');
const { Test } = require('../../../src/models/dbModels');
const testController = require('../../../src/controllers/dbControllers/testController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Test: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Test Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createTest should create a new test', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        TestName: 'Math Test',
        TestDescription: 'Basic math questions',
      },
    });
    const res = httpMocks.createResponse();

    Test.create.mockResolvedValue(req.body);

    await testController.createTest(req, res);

    expect(Test.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getTests should return all tests', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockTests = [
      {
        TestId: 1,
        TestName: 'Math Test',
        TestDescription: 'Basic math questions',
        CreatedDate: '2023-10-01T00:00:00Z',
      },
      {
        TestId: 2,
        TestName: 'Physics Test',
        TestDescription: 'Advanced physics quiz',
        CreatedDate: '2023-10-15T00:00:00Z',
      },
    ];

    Test.findAll.mockResolvedValue(mockTests);

    await testController.getTests(req, res);

    expect(Test.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTests);
  });

  test('getTestById should return test if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTest = {
      TestId: 1,
      TestName: 'Math Test',
      TestDescription: 'Basic math questions',
      CreatedDate: '2023-10-01T00:00:00Z',
    };

    Test.findByPk.mockResolvedValue(mockTest);

    await testController.getTestById(req, res);

    expect(Test.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTest);
  });

  test('searchTests should return matching tests', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        testName: 'Math',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
      },
    });
    const res = httpMocks.createResponse();

    const mockTests = [
      {
        TestId: 1,
        TestName: 'Math Test',
        TestDescription: 'Basic math questions',
        CreatedDate: '2023-10-01T00:00:00Z',
      },
    ];

    Test.findAll.mockResolvedValue(mockTests);

    await testController.searchTests(req, res);

    expect(Test.findAll).toHaveBeenCalledWith({
      where: {
        TestName: { [Op.like]: '%Math%' },
        CreatedDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
      },
      attributes: ['TestId', 'TestName', 'TestDescription', 'CreatedDate'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTests);
  });

  test('updateTest should update an existing test', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { TestName: 'Updated Math Test' },
    });
    const res = httpMocks.createResponse();

    const mockTest = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        TestId: 1,
        TestName: 'Updated Math Test',
        TestDescription: 'Basic math questions',
        CreatedDate: '2023-10-01T00:00:00Z',
      },
      toJSON: jest.fn(() => ({ ...mockTest.dataValues })),
    };

    Test.findByPk.mockResolvedValue(mockTest);

    await testController.updateTest(req, res);

    expect(mockTest.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      TestId: 1,
      TestName: 'Updated Math Test',
      TestDescription: 'Basic math questions',
      CreatedDate: '2023-10-01T00:00:00Z',
    });
    expect(mockTest.toJSON).toHaveBeenCalled();
  });

  test('deleteTest should remove a test', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTest = { destroy: jest.fn().mockResolvedValue(1) };

    Test.findByPk.mockResolvedValue(mockTest);

    await testController.deleteTest(req, res);

    expect(mockTest.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getTestById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Test.findByPk.mockResolvedValue(null);

    await testController.getTestById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Test not found' });
  });

  test('searchTests should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { testName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Test.findAll.mockResolvedValue([]);

    await testController.searchTests(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No tests found matching the criteria.' });
  });
});