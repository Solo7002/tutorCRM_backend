const httpMocks = require('node-mocks-http');
const { MarkHistory, Student, Course } = require('../../../src/models/dbModels');
const markHistoryController = require('../../../src/controllers/dbControllers/markHistoryController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  MarkHistory: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Student: jest.fn(() => ({ name: 'Student' })),
  Course: jest.fn(() => ({ name: 'Course' })),
}));

describe('MarkHistory Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createMarkHistory should create a new mark history', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        Mark: 85,
        MarkType: 'test',
        StudentId: 1,
        CourseId: 1,
      },
    });
    const res = httpMocks.createResponse();

    MarkHistory.create.mockResolvedValue(req.body);

    await markHistoryController.createMarkHistory(req, res);

    expect(MarkHistory.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getMarkHistories should return all mark histories', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockMarkHistories = [
      {
        MarkId: 1,
        Mark: 85,
        MarkType: 'test',
        MarkDate: '2023-10-01T00:00:00Z',
        StudentId: 1,
        CourseId: 1,
      },
    ];

    MarkHistory.findAll.mockResolvedValue(mockMarkHistories);

    await markHistoryController.getMarkHistories(req, res);

    expect(MarkHistory.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockMarkHistories);
  });

  test('getMarkHistoryById should return mark history if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockMarkHistory = {
      MarkId: 1,
      Mark: 85,
      MarkType: 'test',
      MarkDate: '2023-10-01T00:00:00Z',
      StudentId: 1,
      CourseId: 1,
    };

    MarkHistory.findByPk.mockResolvedValue(mockMarkHistory);

    await markHistoryController.getMarkHistoryById(req, res);

    expect(MarkHistory.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockMarkHistory);
  });

  test('searchMarkHistory should return matching mark histories', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        markType: 'test',
        mark: '85',
        studentId: '1',
        courseId: '1',
        startDate: '2023-10-01',
      },
    });
    const res = httpMocks.createResponse();

    const mockMarkHistories = [
      {
        MarkId: 1,
        Mark: 85,
        MarkType: 'test',
        MarkDate: '2023-10-01T00:00:00Z',
        StudentId: 1,
        CourseId: 1,
        Student: { StudentId: 1, FirstName: 'John', LastName: 'Doe' },
        Course: { CourseId: 1, CourseName: 'Mathematics' },
      },
    ];

    MarkHistory.findAll.mockResolvedValue(mockMarkHistories);

    await markHistoryController.searchMarkHistory(req, res);

    expect(MarkHistory.findAll).toHaveBeenCalledWith({
      where: {
        MarkType: 'test',
        Mark: 85,
        StudentId: '1',
        CourseId: '1',
        MarkDate: { [Op.gte]: new Date('2023-10-01') },
      },
      include: [
        {
          model: expect.any(Function),
          as: 'Student',
          attributes: ['StudentId', 'FirstName', 'LastName'],
        },
        {
          model: expect.any(Function),
          as: 'Course',
          attributes: ['CourseId', 'CourseName'],
        },
      ],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockMarkHistories);
  });

  test('updateMarkHistory should update an existing mark history', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { Mark: 90 },
    });
    const res = httpMocks.createResponse();

    const mockMarkHistory = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        MarkId: 1,
        Mark: 90,
        MarkType: 'test',
        MarkDate: '2023-10-01T00:00:00Z',
        StudentId: 1,
        CourseId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockMarkHistory.dataValues })),
    };

    MarkHistory.findByPk.mockResolvedValue(mockMarkHistory);

    await markHistoryController.updateMarkHistory(req, res);

    expect(mockMarkHistory.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      MarkId: 1,
      Mark: 90,
      MarkType: 'test',
      MarkDate: '2023-10-01T00:00:00Z',
      StudentId: 1,
      CourseId: 1,
    });
    expect(mockMarkHistory.toJSON).toHaveBeenCalled();
  });

  test('deleteMarkHistory should remove a mark history', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockMarkHistory = { destroy: jest.fn().mockResolvedValue(1) };

    MarkHistory.findByPk.mockResolvedValue(mockMarkHistory);

    await markHistoryController.deleteMarkHistory(req, res);

    expect(mockMarkHistory.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getMarkHistoryById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    MarkHistory.findByPk.mockResolvedValue(null);

    await markHistoryController.getMarkHistoryById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'MarkHistory not found' });
  });

  test('searchMarkHistory should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { markType: 'nonexistent' } });
    const res = httpMocks.createResponse();

    MarkHistory.findAll.mockResolvedValue([]);

    await markHistoryController.searchMarkHistory(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No mark histories found matching the criteria.' });
  });
});