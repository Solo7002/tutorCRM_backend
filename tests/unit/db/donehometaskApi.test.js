const { DoneHomeTask } = require('../../../src/models/dbModels');
const doneHometaskController = require('../../../src/controllers/dbControllers/doneHometaskController');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');
const { parseQueryParams } = require('../../../src/utils/dbUtils/queryUtils');

jest.mock('../../../src/models/dbModels', () => ({
  DoneHomeTask: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  HomeTask: jest.fn().mockReturnValue({ name: 'HomeTask' }),
  Student: jest.fn().mockReturnValue({ name: 'Student' }),
}));

jest.mock('../../../src/utils/dbUtils/queryUtils', () => ({
  parseQueryParams: jest.fn(),
}));

describe('DoneHomeTask Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createDoneHometask should create a new done hometask', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        Mark: 85,
        DoneDate: '2023-10-01T00:00:00Z',
      },
    });
    const res = httpMocks.createResponse();

    DoneHomeTask.create.mockResolvedValue(req.body);

    await doneHometaskController.createDoneHometask(req, res);

    expect(DoneHomeTask.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getDoneHometasks should return all done hometasks', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
  
    const mockDoneHometasks = [
      { DoneHomeTaskId: 1, Mark: 85, DoneDate: '2023-10-01T00:00:00Z' },
    ];
  
    DoneHomeTask.findAll.mockResolvedValue(mockDoneHometasks);
  
    parseQueryParams.mockReturnValue({
      where: {},
      order: [],
    });
  
    await doneHometaskController.getDoneHometasks(req, res);
  
    expect(DoneHomeTask.findAll).toHaveBeenCalledWith({
      where: {},
      order: [],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockDoneHometasks);
  });
  

  test('getDoneHometaskById should return done hometask if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockDoneHometask = {
      DoneHomeTaskId: 1,
      Mark: 85,
      DoneDate: '2023-10-01T00:00:00Z',
    };

    DoneHomeTask.findByPk.mockResolvedValue(mockDoneHometask);

    await doneHometaskController.getDoneHometaskById(req, res);

    expect(DoneHomeTask.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockDoneHometask);
  });

  test('searchDoneHomeTasks should return matching tasks', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { mark: 85, studentId: '1', homeTaskId: '2', doneDate: '2023-10-01T00:00:00Z' },
    });
    const res = httpMocks.createResponse();
  
    const mockTasks = [
      {
        DoneHomeTaskId: 1,
        Mark: 85,
        DoneDate: '2023-10-01T00:00:00Z',
        HomeTask: { HomeTaskId: 2, TaskName: 'Math Homework' },
        Student: { StudentId: 1, FullName: 'John Doe' },
      },
    ];
  
    DoneHomeTask.findAll.mockResolvedValue(mockTasks);
  
    const dbModels = require('../../../src/models/dbModels');
    dbModels.HomeTask = jest.fn(() => ({ name: 'HomeTask' }));
    dbModels.Student = jest.fn(() => ({ name: 'Student' }));
  
    await doneHometaskController.searchDoneHomeTasks(req, res);
  
    expect(DoneHomeTask.findAll).toHaveBeenCalledWith({
      where: {
        Mark: { [Op.eq]: 85 },
        StudentId: '1',
        HomeTaskId: '2',
        DoneDate: { [Op.eq]: '2023-10-01T00:00:00Z' },
      },
      include: [
        { model: expect.any(Function), as: 'HomeTask', attributes: ['HomeTaskId', 'TaskName'] },
        { model: expect.any(Function), as: 'Student', attributes: ['StudentId', 'FullName'] },
      ],
    });
  
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockTasks);
  });
  

  test('updateDoneHometask should update an existing done hometask', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { Mark: 90 },
    });
    const res = httpMocks.createResponse();

    const mockDoneHometask = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        DoneHomeTaskId: 1,
        Mark: 90,
        DoneDate: '2023-10-01T00:00:00Z',
      },
      toJSON: jest.fn(() => ({ ...mockDoneHometask.dataValues })),
    };

    DoneHomeTask.findByPk.mockResolvedValue(mockDoneHometask);

    await doneHometaskController.updateDoneHometask(req, res);

    expect(mockDoneHometask.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      DoneHomeTaskId: 1,
      Mark: 90,
      DoneDate: '2023-10-01T00:00:00Z',
    });
    expect(mockDoneHometask.toJSON).toHaveBeenCalled();
  });

  test('deleteDoneHometask should remove a done hometask', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockDoneHometask = { destroy: jest.fn().mockResolvedValue(1) };

    DoneHomeTask.findByPk.mockResolvedValue(mockDoneHometask);

    await doneHometaskController.deleteDoneHometask(req, res);

    expect(mockDoneHometask.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getDoneHometaskById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    DoneHomeTask.findByPk.mockResolvedValue(null);

    await doneHometaskController.getDoneHometaskById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'DoneHometask not found' });
  });

  test('searchDoneHomeTasks should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { mark: 100 } });
    const res = httpMocks.createResponse();
  
    DoneHomeTask.findAll.mockResolvedValue([]);
  
    await doneHometaskController.searchDoneHomeTasks(req, res);
  
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No tasks found matching the criteria.' });
  });
});