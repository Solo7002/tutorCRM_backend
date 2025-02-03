const httpMocks = require('node-mocks-http');
const { UserReview } = require('../../../src/models/dbModels');
const userReviewController = require('../../../src/controllers/dbControllers/userReviewController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  UserReview: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('UserReview Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createUserReview should create a new user review', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        ReviewHeader: 'Great App',
        ReviewText: 'I love this app!',
      },
    });
    const res = httpMocks.createResponse();

    UserReview.create.mockResolvedValue(req.body);

    await userReviewController.createUserReview(req, res);

    expect(UserReview.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getUserReviews should return all user reviews', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockUserReviews = [
      {
        UserReviewId: 1,
        ReviewHeader: 'Great App',
        ReviewText: 'I love this app!',
        CreateDate: '2023-10-01T00:00:00Z',
      },
      {
        UserReviewId: 2,
        ReviewHeader: 'Needs Work',
        ReviewText: 'Fix bugs please.',
        CreateDate: '2023-10-15T00:00:00Z',
      },
    ];

    UserReview.findAll.mockResolvedValue(mockUserReviews);

    await userReviewController.getUserReviews(req, res);

    expect(UserReview.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserReviews);
  });

  test('getUserReviewById should return user review if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserReview = {
      UserReviewId: 1,
      ReviewHeader: 'Great App',
      ReviewText: 'I love this app!',
      CreateDate: '2023-10-01T00:00:00Z',
    };

    UserReview.findByPk.mockResolvedValue(mockUserReview);

    await userReviewController.getUserReviewById(req, res);

    expect(UserReview.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockUserReview);
  });

  test('searchUserReviews should return matching user reviews', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        reviewHeader: 'Great',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
      },
    });
    const res = httpMocks.createResponse();

    const mockUserReviews = [
      {
        UserReviewId: 1,
        ReviewHeader: 'Great App',
        ReviewText: 'I love this app!',
        CreateDate: '2023-10-01T00:00:00Z',
      },
    ];

    UserReview.findAll.mockResolvedValue(mockUserReviews);

    await userReviewController.searchUserReviews(req, res);

    expect(UserReview.findAll).toHaveBeenCalledWith({
      where: {
        ReviewHeader: { [Op.like]: '%Great%' },
        CreateDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
      },
      attributes: ['UserReviewId', 'ReviewHeader', 'ReviewText', 'CreateDate'],
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockUserReviews);
  });

  test('updateUserReview should update an existing user review', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { ReviewHeader: 'Updated Great App' },
    });
    const res = httpMocks.createResponse();

    const mockUserReview = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        UserReviewId: 1,
        ReviewHeader: 'Updated Great App',
        ReviewText: 'I love this app!',
        CreateDate: '2023-10-01T00:00:00Z',
      },
      toJSON: jest.fn(() => ({ ...mockUserReview.dataValues })),
    };

    UserReview.findByPk.mockResolvedValue(mockUserReview);

    await userReviewController.updateUserReview(req, res);

    expect(mockUserReview.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      UserReviewId: 1,
      ReviewHeader: 'Updated Great App',
      ReviewText: 'I love this app!',
      CreateDate: '2023-10-01T00:00:00Z',
    });
    expect(mockUserReview.toJSON).toHaveBeenCalled();
  });

  test('deleteUserReview should remove a user review', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockUserReview = { destroy: jest.fn().mockResolvedValue(1) };

    UserReview.findByPk.mockResolvedValue(mockUserReview);

    await userReviewController.deleteUserReview(req, res);

    expect(mockUserReview.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getUserReviewById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    UserReview.findByPk.mockResolvedValue(null);

    await userReviewController.getUserReviewById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'UserReview not found' });
  });

  test('searchUserReviews should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { reviewHeader: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    UserReview.findAll.mockResolvedValue([]);

    await userReviewController.searchUserReviews(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No user reviews found matching the criteria.' });
  });
});