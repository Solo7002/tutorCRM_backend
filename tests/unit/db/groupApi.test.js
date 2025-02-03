const httpMocks = require('node-mocks-http');
const { Group, GroupStudent } = require('../../../src/models/dbModels');
const groupController = require('../../../src/controllers/dbControllers/groupController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Group: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  GroupStudent: jest.fn(() => ({ name: 'GroupStudent' })),
}));

describe('Group Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createGroup should create a new group', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        GroupName: 'Math Group',
        GroupPrice: 100.0,
        ImageFilePath: 'http://example.com/image.jpg',
      },
    });
    const res = httpMocks.createResponse();

    Group.create.mockResolvedValue(req.body);

    await groupController.createGroup(req, res);

    expect(Group.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getGroups should return all groups', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockGroups = [
      {
        GroupId: 1,
        GroupName: 'Math Group',
        GroupPrice: 100.0,
        ImageFilePath: 'http://example.com/image.jpg',
      },
    ];

    Group.findAll.mockResolvedValue(mockGroups);

    await groupController.getGroups(req, res);

    expect(Group.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockGroups);
  });

  test('getGroupById should return group if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockGroup = {
      GroupId: 1,
      GroupName: 'Math Group',
      GroupPrice: 100.0,
      ImageFilePath: 'http://example.com/image.jpg',
    };

    Group.findByPk.mockResolvedValue(mockGroup);

    await groupController.getGroupById(req, res);

    expect(Group.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockGroup);
  });

  test('searchGroups should return matching groups', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { groupName: 'Math', minPrice: '50', maxPrice: '150' },
    });
    const res = httpMocks.createResponse();

    const mockGroups = [
      {
        GroupId: 1,
        GroupName: 'Math Group',
        GroupPrice: 100.0,
        ImageFilePath: 'http://example.com/image.jpg',
        Students: [],
      },
    ];

    Group.findAll.mockResolvedValue(mockGroups);

    await groupController.searchGroups(req, res);

    expect(Group.findAll).toHaveBeenCalledWith({
      where: {
        GroupName: { [Op.like]: '%Math%' },
        GroupPrice: { [Op.between]: [50, 150] },
      },
      include: {
        model: expect.any(Function),
        as: 'Students',
        attributes: ['GroupId', 'StudentId'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockGroups);
  });

  test('updateGroup should update an existing group', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { GroupName: 'Updated Math Group' },
    });
    const res = httpMocks.createResponse();

    const mockGroup = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        GroupId: 1,
        GroupName: 'Updated Math Group',
        GroupPrice: 100.0,
        ImageFilePath: 'http://example.com/image.jpg',
      },
      toJSON: jest.fn(() => ({ ...mockGroup.dataValues })),
    };

    Group.findByPk.mockResolvedValue(mockGroup);

    await groupController.updateGroup(req, res);

    expect(mockGroup.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      GroupId: 1,
      GroupName: 'Updated Math Group',
      GroupPrice: 100.0,
      ImageFilePath: 'http://example.com/image.jpg',
    });
    expect(mockGroup.toJSON).toHaveBeenCalled();
  });

  test('deleteGroup should remove a group', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockGroup = { destroy: jest.fn().mockResolvedValue(1) };

    Group.findByPk.mockResolvedValue(mockGroup);

    await groupController.deleteGroup(req, res);

    expect(mockGroup.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getGroupById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Group.findByPk.mockResolvedValue(null);

    await groupController.getGroupById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Group not found' });
  });

  test('searchGroups should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { groupName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Group.findAll.mockResolvedValue([]);

    await groupController.searchGroups(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No groups found matching the criteria.' });
  });
});