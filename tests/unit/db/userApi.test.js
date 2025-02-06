const { User } = require('../../../src/models/dbModels');
const userController = require('../../../src/controllers/dbControllers/userController');
const httpMocks = require('node-mocks-http');

jest.mock('../../../src/models/dbModels', () => ({
  User: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('User Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUser should create a new user', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        Username: 'testUser',
        Password: 'password123',
        LastName: 'Doe',
        FirstName: 'John',
        Email: 'john.doe@example.com',
      },
    });
    const res = httpMocks.createResponse();

    User.create.mockResolvedValue(req.body);
    await userController.createUser(req, res);

    expect(User.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getUsers should return all users', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();
    const mockUsers = [{ UserId: 1, Username: 'testUser' }];

    User.findAll.mockResolvedValue(mockUsers);
    await userController.getUsers(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUsers);
  });

  test('getUserById should return user if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockUser = { UserId: 1, Username: 'testUser' };

    User.findByPk.mockResolvedValue(mockUser);
    await userController.getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUser);
  });

  test('updateUser should update an existing user', async () => {
    const req = httpMocks.createRequest({ method: 'PUT', params: { id: 1 }, body: { Username: 'updatedUser' } });
    const res = httpMocks.createResponse();
    const mockUser = { update: jest.fn().mockResolvedValue([1]) };

    User.findByPk.mockResolvedValue(mockUser);
    await userController.updateUser(req, res);

    expect(mockUser.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
  });

  test('deleteUser should remove a user', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();
    const mockUser = { destroy: jest.fn().mockResolvedValue(1) };

    User.findByPk.mockResolvedValue(mockUser);
    await userController.deleteUser(req, res);

    expect(mockUser.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'User deleted' });
  });
});
