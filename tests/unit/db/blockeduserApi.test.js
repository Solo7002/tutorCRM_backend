const httpMocks = require('node-mocks-http');
const { BlockedUser, User } = require('../../../src/models/dbModels');
const blockedUserController = require('../../../src/controllers/dbControllers/blockedUserController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  BlockedUser: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  User: {
    findByPk: jest.fn(),
  },
}));

describe('BlockedUser Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createBlockedUser should create a new blocked user if UserId exists', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        UserId: 1,
        ReasonDescription: 'Spamming',
      },
    });
    const res = httpMocks.createResponse();

    const mockUser = {
      UserId: 1,
      Username: 'testuser',
    };
    const mockBlockedUser = {
      BlockedUserId: 1,
      UserId: 1,
      ReasonDescription: 'Spamming',
    };

    User.findByPk.mockResolvedValue(mockUser);
    BlockedUser.create.mockResolvedValue(mockBlockedUser);

    await blockedUserController.createBlockedUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(BlockedUser.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(mockBlockedUser);
  });

  test('createBlockedUser should return 400 if UserId does not exist', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        UserId: 999,
        ReasonDescription: 'Spamming',
      },
    });
    const res = httpMocks.createResponse();

    User.findByPk.mockResolvedValue(null);

    await blockedUserController.createBlockedUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(999);
    expect(res.statusCode).toBe(400);
    expect(res._getJSONData()).toEqual({ error: 'User with the specified UserId does not exist' });
  });

  test('getBlockedUsers should return all blocked users with associated user data', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockBlockedUsers = [
      {
        BlockedUserId: 1,
        UserId: 1,
        ReasonDescription: 'Spamming',
        User: {
          UserId: 1,
          Username: 'testuser',
          Email: 'test@example.com',
        },
      },
    ];

    BlockedUser.findAll.mockResolvedValue(mockBlockedUsers);

    await blockedUserController.getBlockedUsers(req, res);

    expect(BlockedUser.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username', 'Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockBlockedUsers);
  });

  test('getBlockedUserById should return blocked user by id with associated user data', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockBlockedUser = {
      BlockedUserId: 1,
      UserId: 1,
      ReasonDescription: 'Spamming',
      User: {
        UserId: 1,
        Username: 'testuser',
        Email: 'test@example.com',
      },
    };

    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);

    await blockedUserController.getBlockedUserById(req, res);

    expect(BlockedUser.findByPk).toHaveBeenCalledWith(1, {
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username', 'Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockBlockedUser);
  });

  test('searchBlockedUsers should return matching blocked users', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        reasonDescription: 'Spamming',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        userId: '1',
      },
    });
    const res = httpMocks.createResponse();
  
    const mockBlockedUsers = [
      {
        BlockedUserId: 1,
        UserId: 1,
        ReasonDescription: 'Spamming',
        BanStartDate: '2023-10-15T00:00:00.000Z', 
        BanEndDate: '2023-10-20T00:00:00.000Z', 
        User: {
          UserId: 1,
          Username: 'testuser',
          Email: 'test@example.com',
        },
      },
    ];
  
    BlockedUser.findAll.mockResolvedValue(mockBlockedUsers);
  
    await blockedUserController.searchBlockedUsers(req, res);
  
    expect(BlockedUser.findAll).toHaveBeenCalledWith({
      where: {
        ReasonDescription: { [Op.like]: '%Spamming%' },
        BanStartDate: { [Op.gte]: new Date('2023-10-01') },
        BanEndDate: { [Op.lte]: new Date('2023-10-31') },
        UserId: '1',
      },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['UserId', 'Username', 'Password', 'Email', 'LastName', 'FirstName', 'ImageFilePath', 'CreateDate'],
        },
      ],
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockBlockedUsers);
  });

  test('updateBlockedUser should update an existing blocked user', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: {
        ReasonDescription: 'Update Нарушение правил',
      },
    });
    const res = httpMocks.createResponse();
  
    const mockBlockedUser = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        BlockedId: 1,
        UserId: 1,
        ReasonDescription: 'Update Нарушение правил',
        BanStartDate: '2023-10-01T00:00:00.000Z',
        BanEndDate: '2024-01-01T00:00:00.000Z',
      },
      toJSON: jest.fn(() => ({ ...mockBlockedUser.dataValues })),
    };
  
    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);
  
    await blockedUserController.updateBlockedUser(req, res);
  
    expect(BlockedUser.findByPk).toHaveBeenCalledWith(1);
    expect(mockBlockedUser.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
  
    expect(res._getJSONData()).toEqual({
      BlockedId: 1,
      UserId: 1,
      ReasonDescription: 'Update Нарушение правил',
      BanStartDate: '2023-10-01T00:00:00.000Z',
      BanEndDate: '2024-01-01T00:00:00.000Z',
    });
  
    expect(mockBlockedUser.toJSON).toHaveBeenCalled();
  });

  test('deleteBlockedUser should remove a blocked user', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockBlockedUser = {
      destroy: jest.fn().mockResolvedValue(1),
    };

    BlockedUser.findByPk.mockResolvedValue(mockBlockedUser);

    await blockedUserController.deleteBlockedUser(req, res);

    expect(BlockedUser.findByPk).toHaveBeenCalledWith(1);
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