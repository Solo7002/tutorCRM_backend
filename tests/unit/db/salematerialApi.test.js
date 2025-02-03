const httpMocks = require('node-mocks-http');
const { SaleMaterial } = require('../../../src/models/dbModels');
const saleMaterialController = require('../../../src/controllers/dbControllers/saleMaterialController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  SaleMaterial: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('SaleMaterial Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createSaleMaterial should create a new sale material', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        MaterialsHeader: 'Math Notes',
        MaterialsDescription: 'Learn math basics',
        PreviewImagePath: 'http://example.com/image.jpg',
        Price: 100.0,
        VendorId: 1,
      },
    });
    const res = httpMocks.createResponse();

    SaleMaterial.create.mockResolvedValue(req.body);

    await saleMaterialController.createSaleMaterial(req, res);

    expect(SaleMaterial.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getSaleMaterials should return all sale materials', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockSaleMaterials = [
      {
        SaleMaterialId: 1,
        MaterialsHeader: 'Math Notes',
        MaterialsDescription: 'Learn math basics',
        CreatedDate: '2023-10-01T00:00:00Z',
        PreviewImagePath: 'http://example.com/image.jpg',
        Price: 100.0,
        VendorId: 1,
      },
    ];

    SaleMaterial.findAll.mockResolvedValue(mockSaleMaterials);

    await saleMaterialController.getSaleMaterials(req, res);

    expect(SaleMaterial.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSaleMaterials);
  });

  test('getSaleMaterialById should return sale material if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSaleMaterial = {
      SaleMaterialId: 1,
      MaterialsHeader: 'Math Notes',
      MaterialsDescription: 'Learn math basics',
      CreatedDate: '2023-10-01T00:00:00Z',
      PreviewImagePath: 'http://example.com/image.jpg',
      Price: 100.0,
      VendorId: 1,
    };

    SaleMaterial.findByPk.mockResolvedValue(mockSaleMaterial);

    await saleMaterialController.getSaleMaterialById(req, res);

    expect(SaleMaterial.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSaleMaterial);
  });

  test('searchSaleMaterials should return matching sale materials', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        materialsHeader: 'Math',
        price: '100.0',
        vendorId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockSaleMaterials = [
      {
        SaleMaterialId: 1,
        MaterialsHeader: 'Math Notes',
        MaterialsDescription: 'Learn math basics',
        CreatedDate: '2023-10-01T00:00:00Z',
        PreviewImagePath: 'http://example.com/image.jpg',
        Price: 100.0,
        VendorId: 1,
      },
    ];

    SaleMaterial.findAll.mockResolvedValue(mockSaleMaterials);

    await saleMaterialController.searchSaleMaterials(req, res);

    expect(SaleMaterial.findAll).toHaveBeenCalledWith({
      where: {
        MaterialsHeader: { [Op.like]: '%Math%' },
        Price: 100.0,
        VendorId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockSaleMaterials);
  });

  test('updateSaleMaterial should update an existing sale material', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { MaterialsHeader: 'Updated Math Notes' },
    });
    const res = httpMocks.createResponse();

    const mockSaleMaterial = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        SaleMaterialId: 1,
        MaterialsHeader: 'Updated Math Notes',
        MaterialsDescription: 'Learn math basics',
        CreatedDate: '2023-10-01T00:00:00Z',
        PreviewImagePath: 'http://example.com/image.jpg',
        Price: 100.0,
        VendorId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockSaleMaterial.dataValues })),
    };

    SaleMaterial.findByPk.mockResolvedValue(mockSaleMaterial);

    await saleMaterialController.updateSaleMaterial(req, res);

    expect(mockSaleMaterial.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      SaleMaterialId: 1,
      MaterialsHeader: 'Updated Math Notes',
      MaterialsDescription: 'Learn math basics',
      CreatedDate: '2023-10-01T00:00:00Z',
      PreviewImagePath: 'http://example.com/image.jpg',
      Price: 100.0,
      VendorId: 1,
    });
    expect(mockSaleMaterial.toJSON).toHaveBeenCalled();
  });

  test('deleteSaleMaterial should remove a sale material', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSaleMaterial = { destroy: jest.fn().mockResolvedValue(1) };

    SaleMaterial.findByPk.mockResolvedValue(mockSaleMaterial);

    await saleMaterialController.deleteSaleMaterial(req, res);

    expect(mockSaleMaterial.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getSaleMaterialById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    SaleMaterial.findByPk.mockResolvedValue(null);

    await saleMaterialController.getSaleMaterialById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'SaleMaterial not found' });
  });

  test('searchSaleMaterials should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { materialsHeader: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    SaleMaterial.findAll.mockResolvedValue([]);

    await saleMaterialController.searchSaleMaterials(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No sale materials found matching the criteria.' });
  });
});