const httpMocks = require('node-mocks-http');
const { UserComplaint } = require('../../../src/models/dbModels');
const userComplaintController = require('../../../src/controllers/dbControllers/userComplaintController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  UserComplaint: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('UserComplaint Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUserComplaint should create a new user complaint', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        ComplaintDescription: 'Issue with login',
      },
    });
    const res = httpMocks.createResponse();

    UserComplaint.create.mockResolvedValue(req.body);

    await userComplaintController.createUserComplaint(req, res);

    expect(UserComplaint.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getUserComplaints should return all user complaints', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockUserComplaints = [
      {
        UserComplaintId: 1,
        ComplaintDate: '2023-10-01T00:00:00Z',
        ComplaintDescription: 'Issue with login',
      },
      {
        UserComplaintId: 2,
        ComplaintDate: '2023-10-15T00:00:00Z',
        ComplaintDescription: 'Payment failed',
      },
    ];

    UserComplaint.findAll.mockResolvedValue(mockUserComplaints);

    await userComplaintController.getUserComplaints(req, res);

    expect(UserComplaint.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserComplaints);
  });

  test('getUserComplaintById should return user complaint if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserComplaint = {
      UserComplaintId: 1,
      ComplaintDate: '2023-10-01T00:00:00Z',
      ComplaintDescription: 'Issue with login',
    };

    UserComplaint.findByPk.mockResolvedValue(mockUserComplaint);

    await userComplaintController.getUserComplaintById(req, res);

    expect(UserComplaint.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserComplaint);
  });

  test('searchUserComplaints should return matching user complaints', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        description: 'login',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
      },
    });
    const res = httpMocks.createResponse();

    const mockUserComplaints = [
      {
        UserComplaintId: 1,
        ComplaintDate: '2023-10-01T00:00:00Z',
        ComplaintDescription: 'Issue with login',
      },
    ];

    UserComplaint.findAll.mockResolvedValue(mockUserComplaints);

    await userComplaintController.searchUserComplaints(req, res);

    expect(UserComplaint.findAll).toHaveBeenCalledWith({
      where: {
        ComplaintDescription: { [Op.like]: '%login%' },
        ComplaintDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
      },
      attributes: ['UserComplaintId', 'ComplaintDate', 'ComplaintDescription'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockUserComplaints);
  });

  test('updateUserComplaint should update an existing user complaint', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { ComplaintDescription: 'Updated issue with login' },
    });
    const res = httpMocks.createResponse();

    const mockUserComplaint = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        UserComplaintId: 1,
        ComplaintDate: '2023-10-01T00:00:00Z',
        ComplaintDescription: 'Updated issue with login',
      },
      toJSON: jest.fn(() => ({ ...mockUserComplaint.dataValues })),
    };

    UserComplaint.findByPk.mockResolvedValue(mockUserComplaint);

    await userComplaintController.updateUserComplaint(req, res);

    expect(mockUserComplaint.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      UserComplaintId: 1,
      ComplaintDate: '2023-10-01T00:00:00Z',
      ComplaintDescription: 'Updated issue with login',
    });
    expect(mockUserComplaint.toJSON).toHaveBeenCalled();
  });

  test('deleteUserComplaint should remove a user complaint', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserComplaint = { destroy: jest.fn().mockResolvedValue(1) };

    UserComplaint.findByPk.mockResolvedValue(mockUserComplaint);

    await userComplaintController.deleteUserComplaint(req, res);

    expect(mockUserComplaint.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getUserComplaintById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    UserComplaint.findByPk.mockResolvedValue(null);

    await userComplaintController.getUserComplaintById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'UserComplaint not found' });
  });

  test('searchUserComplaints should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { description: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    UserComplaint.findAll.mockResolvedValue([]);

    await userComplaintController.searchUserComplaints(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No user complaints found matching the criteria.' });
  });
});