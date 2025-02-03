const { BlockedUser } = require('../../../src/models/dbModels');
const blockedUserController = require('../../../src/controllers/dbControllers/blockedUserController');
const httpMocks = require('node-mocks-http');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  BlockedUser: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  User: jest.fn().mockReturnValue({
    name: 'User',
  }),
}));

describe('BlockedUser Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createBlockedUser should create a new blocked user', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        ReasonDescription: 'Violation of community guidelines',
        BanStartDate: '2023-01-01',
        BanEndDate: '2023-12-31',
      },
    });
    const res = httpMocks.createResponse();
    BlockedUser.create.mockResolvedValue(req.body);
    await blockedUserController.createBlockedUser(req, res);
    expect(BlockedUser.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getBlockedUsers should return all blocked users', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    const mockBlockedUsers = [
      { BlockedId: 1, ReasonDescription: 'Violation', BanStartDate: '2023-01-01', BanEndDate: '2023-12-31' },
    ];
    BlockedUser.findAll.mockResolvedValue(mockBlockedUsers);
    await blockedUserController.getBlockedUsers(req, res);
    expect(BlockedUser.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockBlockedUsers);
  });

  test('getBlockedUserById should return blocked user if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockBlockedUser = {
      BlockedId: 1,
      ReasonDescription: 'Violation',
      BanStartDate: '2023-01-01',
      BanEndDate: '2023-12-31',
    };
    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);
    await blockedUserController.getBlockedUserById(req, res);
    expect(BlockedUser.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockBlockedUser);
  });

  test('searchBlockedUsers should return matching blocked users', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { reasonDescription: 'Violation', startDate: '2023-01-01', endDate: '2023-12-31' },
    });
    const res = httpMocks.createResponse();

    const mockBlockedUsers = [
      {
        BlockedId: 1,
        ReasonDescription: 'Violation',
        BanStartDate: '2023-01-01',
        BanEndDate: '2023-12-31',
        User: { UserId: 1, Username: 'testUser', Email: 'test@example.com' },
      },
    ];

    BlockedUser.findAll.mockResolvedValue(mockBlockedUsers);

    const dbModels = require('../../../src/models/dbModels');
    dbModels.User = jest.fn().mockReturnValue({
      name: 'User', 
    });

    await blockedUserController.searchBlockedUsers(req, res);

    expect(BlockedUser.findAll).toHaveBeenCalledWith({
      where: {
        ReasonDescription: { [Op.like]: '%Violation%' },
        BanStartDate: { [Op.gte]: new Date('2023-01-01') },
        BanEndDate: { [Op.lte]: new Date('2023-12-31') },
      },
      include: {
        model: expect.any(Function),
        as: 'User',
        attributes: ['UserId', 'Username', 'Email'],
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockBlockedUsers);
  });

  test('updateBlockedUser should update an existing blocked user', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { ReasonDescription: 'Updated violation reason' },
    });
    const res = httpMocks.createResponse();

    const mockBlockedUser = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        BlockedId: 1,
        ReasonDescription: 'Updated violation reason',
        BanStartDate: '2023-01-01',
        BanEndDate: '2023-12-31',
      },
      toJSON: jest.fn(() => ({ ...mockBlockedUser.dataValues })),
    };

    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);

    await blockedUserController.updateBlockedUser(req, res);

    expect(mockBlockedUser.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      BlockedId: 1,
      ReasonDescription: 'Updated violation reason',
      BanStartDate: '2023-01-01',
      BanEndDate: '2023-12-31',
    });
    expect(mockBlockedUser.toJSON).toHaveBeenCalled();
  });

  test('deleteBlockedUser should remove a blocked user', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockBlockedUser = { destroy: jest.fn().mockResolvedValue(1) };
    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);
    await blockedUserController.deleteBlockedUser(req, res);
    expect(mockBlockedUser.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getBlockedUserById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();
    BlockedUser.findByPk.mockResolvedValue(null);
    await blockedUserController.getBlockedUserById(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'BlockedUser not found' });
  });

  test('searchBlockedUsers should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { reasonDescription: 'Nonexistent' } });
    const res = httpMocks.createResponse();
    BlockedUser.findAll.mockResolvedValue([]);
    await blockedUserController.searchBlockedUsers(req, res);
    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No blocked users found matching the criteria.' });
  });
});