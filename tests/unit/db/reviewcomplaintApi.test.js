const httpMocks = require('node-mocks-http');
const { ReviewComplaint } = require('../../../src/models/dbModels');
const reviewComplaintController = require('../../../src/controllers/dbControllers/reviewComplaintController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  ReviewComplaint: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('ReviewComplaint Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createReviewComplaint should create a new review complaint', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        ComplaintDescription: 'Poor quality',
        UserFromId: 1,
        ReviewId: 1,
      },
    });
    const res = httpMocks.createResponse();

    ReviewComplaint.create.mockResolvedValue(req.body);

    await reviewComplaintController.createReviewComplaint(req, res);

    expect(ReviewComplaint.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getReviewComplaints should return all review complaints', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockReviewComplaints = [
      {
        ReviewComplaintId: 1,
        ComplaintDate: '2023-10-01T00:00:00Z',
        ComplaintDescription: 'Poor quality',
        UserFromId: 1,
        ReviewId: 1,
      },
    ];

    ReviewComplaint.findAll.mockResolvedValue(mockReviewComplaints);

    await reviewComplaintController.getReviewComplaints(req, res);

    expect(ReviewComplaint.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockReviewComplaints);
  });

  test('getReviewComplaintById should return review complaint if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockReviewComplaint = {
      ReviewComplaintId: 1,
      ComplaintDate: '2023-10-01T00:00:00Z',
      ComplaintDescription: 'Poor quality',
      UserFromId: 1,
      ReviewId: 1,
    };

    ReviewComplaint.findByPk.mockResolvedValue(mockReviewComplaint);

    await reviewComplaintController.getReviewComplaintById(req, res);

    expect(ReviewComplaint.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockReviewComplaint);
  });

  test('searchReviewComplaints should return matching review complaints', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        complaintDescription: 'Poor',
        userFromId: '1',
        reviewId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockReviewComplaints = [
      {
        ReviewComplaintId: 1,
        ComplaintDate: '2023-10-15T00:00:00Z',
        ComplaintDescription: 'Poor quality',
        UserFromId: 1,
        ReviewId: 1,
      },
    ];

    ReviewComplaint.findAll.mockResolvedValue(mockReviewComplaints);

    await reviewComplaintController.searchReviewComplaints(req, res);

    expect(ReviewComplaint.findAll).toHaveBeenCalledWith({
      where: {
        ComplaintDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
        ComplaintDescription: { [Op.like]: '%Poor%' },
        UserFromId: '1',
        ReviewId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockReviewComplaints);
  });

  test('updateReviewComplaint should update an existing review complaint', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { ComplaintDescription: 'Updated description' },
    });
    const res = httpMocks.createResponse();

    const mockReviewComplaint = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        ReviewComplaintId: 1,
        ComplaintDate: '2023-10-01T00:00:00Z',
        ComplaintDescription: 'Updated description',
        UserFromId: 1,
        ReviewId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockReviewComplaint.dataValues })),
    };

    ReviewComplaint.findByPk.mockResolvedValue(mockReviewComplaint);

    await reviewComplaintController.updateReviewComplaint(req, res);

    expect(mockReviewComplaint.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      ReviewComplaintId: 1,
      ComplaintDate: '2023-10-01T00:00:00Z',
      ComplaintDescription: 'Updated description',
      UserFromId: 1,
      ReviewId: 1,
    });
    expect(mockReviewComplaint.toJSON).toHaveBeenCalled();
  });

  test('deleteReviewComplaint should remove a review complaint', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockReviewComplaint = { destroy: jest.fn().mockResolvedValue(1) };

    ReviewComplaint.findByPk.mockResolvedValue(mockReviewComplaint);

    await reviewComplaintController.deleteReviewComplaint(req, res);

    expect(mockReviewComplaint.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getReviewComplaintById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    ReviewComplaint.findByPk.mockResolvedValue(null);

    await reviewComplaintController.getReviewComplaintById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'ReviewComplaint not found' });
  });

  test('searchReviewComplaints should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { complaintDescription: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    ReviewComplaint.findAll.mockResolvedValue([]);

    await reviewComplaintController.searchReviewComplaints(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No review complaints found matching the criteria.' });
  });
});