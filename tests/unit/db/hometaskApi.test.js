const httpMocks = require('node-mocks-http');
const { HomeTask, Group } = require('../../../src/models/dbModels');
const homeTaskController = require('../../../src/controllers/dbControllers/homeTaskController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  HomeTask: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  Group: jest.fn(() => ({ name: 'Group' })),
}));

describe('HomeTask Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createHomeTask should create a new home task', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        HomeTaskHeader: 'Math Homework',
        HomeTaskDescription: 'Solve problems 1-10',
        StartDate: '2023-10-01T00:00:00Z',
        DeadlineDate: '2023-10-10T00:00:00Z',
        MaxMark: 100,
        GroupId: 1,
      },
    });
    const res = httpMocks.createResponse();

    HomeTask.create.mockResolvedValue(req.body);

    await homeTaskController.createHomeTask(req, res);

    expect(HomeTask.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getHomeTasks should return all home tasks', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockHomeTasks = [
      {
        HomeTaskId: 1,
        HomeTaskHeader: 'Math Homework',
        HomeTaskDescription: 'Solve problems 1-10',
        StartDate: '2023-10-01T00:00:00Z',
        DeadlineDate: '2023-10-10T00:00:00Z',
        MaxMark: 100,
        GroupId: 1,
      },
    ];

    HomeTask.findAll.mockResolvedValue(mockHomeTasks);

    await homeTaskController.getHomeTasks(req, res);

    expect(HomeTask.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockHomeTasks);
  });

  test('getHomeTaskById should return home task if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockHomeTask = {
      HomeTaskId: 1,
      HomeTaskHeader: 'Math Homework',
      HomeTaskDescription: 'Solve problems 1-10',
      StartDate: '2023-10-01T00:00:00Z',
      DeadlineDate: '2023-10-10T00:00:00Z',
      MaxMark: 100,
      GroupId: 1,
    };

    HomeTask.findByPk.mockResolvedValue(mockHomeTask);

    await homeTaskController.getHomeTaskById(req, res);

    expect(HomeTask.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockHomeTask);
  });

  test('searchHomeTasks should return matching home tasks', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        homeTaskHeader: 'Math',
        groupId: '1',
        startDate: '2023-10-01',
        deadlineDate: '2023-10-10',
      },
    });
    const res = httpMocks.createResponse();

    const mockHomeTasks = [
      {
        HomeTaskId: 1,
        HomeTaskHeader: 'Math Homework',
        HomeTaskDescription: 'Solve problems 1-10',
        StartDate: '2023-10-01T00:00:00Z',
        DeadlineDate: '2023-10-10T00:00:00Z',
        MaxMark: 100,
        GroupId: 1,
        Group: { GroupId: 1, GroupName: 'Math Group' },
      },
    ];

    HomeTask.findAll.mockResolvedValue(mockHomeTasks);

    await homeTaskController.searchHomeTasks(req, res);

    expect(HomeTask.findAll).toHaveBeenCalledWith({
      where: {
        HomeTaskHeader: { [Op.like]: '%Math%' },
        GroupId: '1',
        StartDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-10')] },
      },
      include: {
        model: expect.any(Function),
        as: 'Group',
        attributes: ['GroupId', 'GroupName'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockHomeTasks);
  });

  test('updateHomeTask should update an existing home task', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { HomeTaskHeader: 'Updated Math Homework' },
    });
    const res = httpMocks.createResponse();

    const mockHomeTask = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        HomeTaskId: 1,
        HomeTaskHeader: 'Updated Math Homework',
        HomeTaskDescription: 'Solve problems 1-10',
        StartDate: '2023-10-01T00:00:00Z',
        DeadlineDate: '2023-10-10T00:00:00Z',
        MaxMark: 100,
        GroupId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockHomeTask.dataValues })),
    };

    HomeTask.findByPk.mockResolvedValue(mockHomeTask);

    await homeTaskController.updateHomeTask(req, res);

    expect(mockHomeTask.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      HomeTaskId: 1,
      HomeTaskHeader: 'Updated Math Homework',
      HomeTaskDescription: 'Solve problems 1-10',
      StartDate: '2023-10-01T00:00:00Z',
      DeadlineDate: '2023-10-10T00:00:00Z',
      MaxMark: 100,
      GroupId: 1,
    });
    expect(mockHomeTask.toJSON).toHaveBeenCalled();
  });

  test('deleteHomeTask should remove a home task', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockHomeTask = { destroy: jest.fn().mockResolvedValue(1) };

    HomeTask.findByPk.mockResolvedValue(mockHomeTask);

    await homeTaskController.deleteHomeTask(req, res);

    expect(mockHomeTask.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getHomeTaskById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    HomeTask.findByPk.mockResolvedValue(null);

    await homeTaskController.getHomeTaskById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'HomeTask not found' });
  });

  test('searchHomeTasks should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { homeTaskHeader: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    HomeTask.findAll.mockResolvedValue([]);

    await homeTaskController.searchHomeTasks(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No home tasks found matching the criteria.' });
  });
});