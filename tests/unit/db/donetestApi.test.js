const httpMocks = require('node-mocks-http');
const { DoneTest, Student, Test } = require('../../../src/models/dbModels');
const doneTestController = require('../../../src/controllers/dbControllers/doneTestController');
const { Op } = require('sequelize');

// Мокируем модели
jest.mock('../../../src/models/dbModels', () => ({
  DoneTest: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Student: jest.fn(() => ({ name: 'Student' })),
  Test: jest.fn(() => ({ name: 'Test' })),
}));

describe('DoneTest Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createDoneTest should create a new test', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        Mark: 85,
        DoneDate: '2023-10-01T00:00:00Z',
        SpentTime: '01:30:00',
        StudentId: 1,
        TestId: 1,
      },
    });
    const res = httpMocks.createResponse();

    DoneTest.create.mockResolvedValue(req.body);

    await doneTestController.createDoneTest(req, res);

    expect(DoneTest.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getDoneTests should return all tests', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockTests = [
      {
        DoneTestId: 1,
        Mark: 85,
        DoneDate: '2023-10-01T00:00:00Z',
        SpentTime: '01:30:00',
        StudentId: 1,
        TestId: 1,
      },
    ];

    DoneTest.findAll.mockResolvedValue(mockTests);

    await doneTestController.getDoneTests(req, res);

    expect(DoneTest.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTests);
  });

  test('getDoneTestById should return test if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTest = {
      DoneTestId: 1,
      Mark: 85,
      DoneDate: '2023-10-01T00:00:00Z',
      SpentTime: '01:30:00',
      StudentId: 1,
      TestId: 1,
    };

    DoneTest.findByPk.mockResolvedValue(mockTest);

    await doneTestController.getDoneTestById(req, res);

    expect(DoneTest.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockTest);
  });

  test('searchDoneTests should return matching tests', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { mark: 85, startDate: '2023-10-01', endDate: '2023-10-02', studentId: '1', testId: '1' },
    });
    const res = httpMocks.createResponse();

    const mockTests = [
      {
        DoneTestId: 1,
        Mark: 85,
        DoneDate: '2023-10-01T00:00:00Z',
        SpentTime: '01:30:00',
        StudentId: 1,
        TestId: 1,
        Student: { StudentId: 1, FirstName: 'John', LastName: 'Doe' },
        Test: { TestId: 1, TestName: 'Math Test' },
      },
    ];

    DoneTest.findAll.mockResolvedValue(mockTests);

    await doneTestController.searchDoneTests(req, res);

    expect(DoneTest.findAll).toHaveBeenCalledWith({
      where: {
        Mark: { [Op.eq]: 85 },
        DoneDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-02')] },
        StudentId: '1',
        TestId: '1',
      },
      include: [
        { model: expect.any(Function), as: 'Student', attributes: ['StudentId', 'FirstName', 'LastName'] },
        { model: expect.any(Function), as: 'Test', attributes: ['TestId', 'TestName'] },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTests);
  });

  test('updateDoneTest should update an existing test', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { Mark: 90 },
    });
    const res = httpMocks.createResponse();

    const mockTest = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        DoneTestId: 1,
        Mark: 90,
        DoneDate: '2023-10-01T00:00:00Z',
        SpentTime: '01:30:00',
        StudentId: 1,
        TestId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockTest.dataValues })),
    };

    DoneTest.findByPk.mockResolvedValue(mockTest);

    await doneTestController.updateDoneTest(req, res);

    expect(mockTest.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      DoneTestId: 1,
      Mark: 90,
      DoneDate: '2023-10-01T00:00:00Z',
      SpentTime: '01:30:00',
      StudentId: 1,
      TestId: 1,
    });
    expect(mockTest.toJSON).toHaveBeenCalled();
  });

  test('deleteDoneTest should remove a test', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockTest = { destroy: jest.fn().mockResolvedValue(1) };

    DoneTest.findByPk.mockResolvedValue(mockTest);

    await doneTestController.deleteDoneTest(req, res);

    expect(mockTest.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getDoneTestById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    DoneTest.findByPk.mockResolvedValue(null);

    await doneTestController.getDoneTestById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'DoneTest not found' });
  });

  test('searchDoneTests should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { mark: 100 } });
    const res = httpMocks.createResponse();

    DoneTest.findAll.mockResolvedValue([]);

    await doneTestController.searchDoneTests(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No tests found matching the criteria.' });
  });
});