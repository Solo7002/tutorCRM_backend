const httpMocks = require('node-mocks-http');
const { Location } = require('../../../src/models/dbModels');
const locationController = require('../../../src/controllers/dbControllers/locationController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  Location: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('Location Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createLocation should create a new location', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        City: 'New York',
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: 'Times Square',
      },
    });
    const res = httpMocks.createResponse();

    Location.create.mockResolvedValue(req.body);

    await locationController.createLocation(req, res);

    expect(Location.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getLocations should return all locations', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockLocations = [
      {
        LocationId: 1,
        City: 'New York',
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: 'Times Square',
      },
    ];

    Location.findAll.mockResolvedValue(mockLocations);

    await locationController.getLocations(req, res);

    expect(Location.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockLocations);
  });

  test('getLocationById should return location if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockLocation = {
      LocationId: 1,
      City: 'New York',
      Country: 'USA',
      Latitude: 40.7128,
      Longitude: -74.006,
      Address: 'Times Square',
    };

    Location.findByPk.mockResolvedValue(mockLocation);

    await locationController.getLocationById(req, res);

    expect(Location.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockLocation);
  });

  test('searchLocations should return matching locations', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: { city: 'New', country: 'USA', latitude: '40.7128', longitude: '-74.006', address: 'Square' },
    });
    const res = httpMocks.createResponse();

    const mockLocations = [
      {
        LocationId: 1,
        City: 'New York',
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: 'Times Square',
      },
    ];

    Location.findAll.mockResolvedValue(mockLocations);

    await locationController.searchLocations(req, res);

    expect(Location.findAll).toHaveBeenCalledWith({
      where: {
        City: { [Op.like]: '%New%' },
        Country: { [Op.like]: '%USA%' },
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: { [Op.like]: '%Square%' },
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockLocations);
  });

  test('updateLocation should update an existing location', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { City: 'Updated New York' },
    });
    const res = httpMocks.createResponse();

    const mockLocation = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        LocationId: 1,
        City: 'Updated New York',
        Country: 'USA',
        Latitude: 40.7128,
        Longitude: -74.006,
        Address: 'Times Square',
      },
      toJSON: jest.fn(() => ({ ...mockLocation.dataValues })),
    };

    Location.findByPk.mockResolvedValue(mockLocation);

    await locationController.updateLocation(req, res);

    expect(mockLocation.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      LocationId: 1,
      City: 'Updated New York',
      Country: 'USA',
      Latitude: 40.7128,
      Longitude: -74.006,
      Address: 'Times Square',
    });
    expect(mockLocation.toJSON).toHaveBeenCalled();
  });

  test('deleteLocation should remove a location', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockLocation = { destroy: jest.fn().mockResolvedValue(1) };

    Location.findByPk.mockResolvedValue(mockLocation);

    await locationController.deleteLocation(req, res);

    expect(mockLocation.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getLocationById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    Location.findByPk.mockResolvedValue(null);

    await locationController.getLocationById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'Location not found' });
  });

  test('searchLocations should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { city: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    Location.findAll.mockResolvedValue([]);

    await locationController.searchLocations(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No locations found matching the criteria.' });
  });
});