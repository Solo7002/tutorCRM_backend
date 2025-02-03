const httpMocks = require('node-mocks-http');
const { Subscription } = require('../../../src/models/dbModels');
const subscriptionController = require('../../../src/controllers/dbControllers/subscriptionController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Subscription: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Subscription Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createSubscription should create a new subscription', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        SubscriptionName: 'Basic',
        SubscriptionDescription: 'Basic plan',
        SubscriptionPrice: 9.99,
      },
    });
    const res = httpMocks.createResponse();

    Subscription.create.mockResolvedValue(req.body);

    await subscriptionController.createSubscription(req, res);

    expect(Subscription.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getSubscriptions should return all subscriptions', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockSubscriptions = [
      {
        SubscriptionLevelId: 1,
        SubscriptionName: 'Basic',
        SubscriptionDescription: 'Basic plan',
        SubscriptionPrice: 9.99,
      },
      {
        SubscriptionLevelId: 2,
        SubscriptionName: 'Premium',
        SubscriptionDescription: 'Premium plan',
        SubscriptionPrice: 19.99,
      },
    ];

    Subscription.findAll.mockResolvedValue(mockSubscriptions);

    await subscriptionController.getSubscriptions(req, res);

    expect(Subscription.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSubscriptions);
  });

  test('getSubscriptionById should return subscription if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSubscription = {
      SubscriptionLevelId: 1,
      SubscriptionName: 'Basic',
      SubscriptionDescription: 'Basic plan',
      SubscriptionPrice: 9.99,
    };

    Subscription.findByPk.mockResolvedValue(mockSubscription);

    await subscriptionController.getSubscriptionById(req, res);

    expect(Subscription.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSubscription);
  });

  test('searchSubscriptions should return matching subscriptions', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        subscriptionName: 'Basic',
        subscriptionPrice: '9.99',
      },
    });
    const res = httpMocks.createResponse();

    const mockSubscriptions = [
      {
        SubscriptionLevelId: 1,
        SubscriptionName: 'Basic',
        SubscriptionDescription: 'Basic plan',
        SubscriptionPrice: 9.99,
      },
    ];

    Subscription.findAll.mockResolvedValue(mockSubscriptions);

    await subscriptionController.searchSubscriptions(req, res);

    expect(Subscription.findAll).toHaveBeenCalledWith({
      where: {
        SubscriptionName: { [Op.like]: '%Basic%' },
        SubscriptionPrice: 9.99,
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockSubscriptions);
  });

  test('updateSubscription should update an existing subscription', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { SubscriptionName: 'Updated Basic' },
    });
    const res = httpMocks.createResponse();

    const mockSubscription = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        SubscriptionLevelId: 1,
        SubscriptionName: 'Updated Basic',
        SubscriptionDescription: 'Basic plan',
        SubscriptionPrice: 9.99,
      },
      toJSON: jest.fn(() => ({ ...mockSubscription.dataValues })),
    };

    Subscription.findByPk.mockResolvedValue(mockSubscription);

    await subscriptionController.updateSubscription(req, res);

    expect(mockSubscription.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      SubscriptionLevelId: 1,
      SubscriptionName: 'Updated Basic',
      SubscriptionDescription: 'Basic plan',
      SubscriptionPrice: 9.99,
    });
    expect(mockSubscription.toJSON).toHaveBeenCalled();
  });

  test('deleteSubscription should remove a subscription', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSubscription = { destroy: jest.fn().mockResolvedValue(1) };

    Subscription.findByPk.mockResolvedValue(mockSubscription);

    await subscriptionController.deleteSubscription(req, res);

    expect(mockSubscription.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({ message: 'Subscription deleted successfully' });
  });

  test('getSubscriptionById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Subscription.findByPk.mockResolvedValue(null);

    await subscriptionController.getSubscriptionById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Subscription not found' });
  });

  test('searchSubscriptions should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { subscriptionName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Subscription.findAll.mockResolvedValue([]);

    await subscriptionController.searchSubscriptions(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No subscriptions found.' });
  });
});