const httpMocks = require('node-mocks-http');
const { UserPhone } = require('../../../src/models/dbModels');
const userPhoneController = require('../../../src/controllers/dbControllers/userPhoneController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  UserPhone: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('UserPhone Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUserPhone should create a new user phone', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        PhoneNumber: '+1 123-456-7890',
        NickName: 'John',
        SocialNetworkName: 'Facebook',
      },
    });
    const res = httpMocks.createResponse();

    UserPhone.create.mockResolvedValue(req.body);

    await userPhoneController.createUserPhone(req, res);

    expect(UserPhone.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getUserPhones should return all user phones', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockUserPhones = [
      {
        UserPhoneId: 1,
        PhoneNumber: '+1 123-456-7890',
        NickName: 'John',
        SocialNetworkName: 'Facebook',
      },
      {
        UserPhoneId: 2,
        PhoneNumber: '(123) 456-7890',
        NickName: 'Jane',
        SocialNetworkName: 'Instagram',
      },
    ];

    UserPhone.findAll.mockResolvedValue(mockUserPhones);

    await userPhoneController.getUserPhones(req, res);

    expect(UserPhone.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserPhones);
  });

  test('getUserPhoneById should return user phone if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserPhone = {
      UserPhoneId: 1,
      PhoneNumber: '+1 123-456-7890',
      NickName: 'John',
      SocialNetworkName: 'Facebook',
    };

    UserPhone.findByPk.mockResolvedValue(mockUserPhone);

    await userPhoneController.getUserPhoneById(req, res);

    expect(UserPhone.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserPhone);
  });

  test('searchUserPhones should return matching user phones', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        phoneNumber: '123',
        nickname: 'John',
      },
    });
    const res = httpMocks.createResponse();

    const mockUserPhones = [
      {
        UserPhoneId: 1,
        PhoneNumber: '+1 123-456-7890',
        NickName: 'John',
        SocialNetworkName: 'Facebook',
      },
    ];

    UserPhone.findAll.mockResolvedValue(mockUserPhones);

    await userPhoneController.searchUserPhones(req, res);

    expect(UserPhone.findAll).toHaveBeenCalledWith({
      where: {
        PhoneNumber: { [Op.like]: '%123%' },
        NickName: { [Op.like]: '%John%' },
      },
      attributes: ['UserPhoneId', 'PhoneNumber', 'NickName', 'SocialNetworkName'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockUserPhones);
  });

  test('updateUserPhone should update an existing user phone', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { NickName: 'Updated John' },
    });
    const res = httpMocks.createResponse();

    const mockUserPhone = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        UserPhoneId: 1,
        PhoneNumber: '+1 123-456-7890',
        NickName: 'Updated John',
        SocialNetworkName: 'Facebook',
      },
      toJSON: jest.fn(() => ({ ...mockUserPhone.dataValues })),
    };

    UserPhone.findByPk.mockResolvedValue(mockUserPhone);

    await userPhoneController.updateUserPhone(req, res);

    expect(mockUserPhone.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      UserPhoneId: 1,
      PhoneNumber: '+1 123-456-7890',
      NickName: 'Updated John',
      SocialNetworkName: 'Facebook',
    });
    expect(mockUserPhone.toJSON).toHaveBeenCalled();
  });

  test('deleteUserPhone should remove a user phone', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserPhone = { destroy: jest.fn().mockResolvedValue(1) };

    UserPhone.findByPk.mockResolvedValue(mockUserPhone);

    await userPhoneController.deleteUserPhone(req, res);

    expect(mockUserPhone.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getUserPhoneById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    UserPhone.findByPk.mockResolvedValue(null);

    await userPhoneController.getUserPhoneById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'UserPhone not found' });
  });

  test('searchUserPhones should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { phoneNumber: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    UserPhone.findAll.mockResolvedValue([]);

    await userPhoneController.searchUserPhones(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No user phones found matching the criteria.' });
  });
});