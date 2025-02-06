const httpMocks = require('node-mocks-http');
const { PurchasedMaterial } = require('../../../src/models/dbModels');
const purchasedMaterialController = require('../../../src/controllers/dbControllers/purchasedMaterialController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  PurchasedMaterial: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('PurchasedMaterial Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createPurchasedMaterial should create a new purchased material', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        SaleMaterialId: 1,
        PurchaserId: 1,
      },
    });
    const res = httpMocks.createResponse();

    PurchasedMaterial.create.mockResolvedValue(req.body);

    await purchasedMaterialController.createPurchasedMaterial(req, res);

    expect(PurchasedMaterial.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getPurchasedMaterials should return all purchased materials', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockPurchasedMaterials = [
      {
        PurchasedMaterialId: 1,
        SaleMaterialId: 1,
        PurchaserId: 1,
        PurchasedDate: '2023-10-01T00:00:00Z',
      },
    ];

    PurchasedMaterial.findAll.mockResolvedValue(mockPurchasedMaterials);

    await purchasedMaterialController.getPurchasedMaterials(req, res);

    expect(PurchasedMaterial.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockPurchasedMaterials);
  });

  test('getPurchasedMaterialById should return purchased material if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockPurchasedMaterial = {
      PurchasedMaterialId: 1,
      SaleMaterialId: 1,
      PurchaserId: 1,
      PurchasedDate: '2023-10-01T00:00:00Z',
    };

    PurchasedMaterial.findByPk.mockResolvedValue(mockPurchasedMaterial);

    await purchasedMaterialController.getPurchasedMaterialById(req, res);

    expect(PurchasedMaterial.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockPurchasedMaterial);
  });

  test('searchPurchasedMaterials should return matching purchased materials', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        materialId: '1',
        purchaserId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockPurchasedMaterials = [
      {
        PurchasedMaterialId: 1,
        SaleMaterialId: 1,
        PurchaserId: 1,
        PurchasedDate: '2023-10-15T00:00:00Z',
      },
    ];

    PurchasedMaterial.findAll.mockResolvedValue(mockPurchasedMaterials);

    await purchasedMaterialController.searchPurchasedMaterials(req, res);

    expect(PurchasedMaterial.findAll).toHaveBeenCalledWith({
      where: {
        PurchasedDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
        SaleMaterialId: '1',
        PurchaserId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockPurchasedMaterials);
  });

  test('updatePurchasedMaterial should update an existing purchased material', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { SaleMaterialId: 2 },
    });
    const res = httpMocks.createResponse();

    const mockPurchasedMaterial = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        PurchasedMaterialId: 1,
        SaleMaterialId: 2,
        PurchaserId: 1,
        PurchasedDate: '2023-10-01T00:00:00Z',
      },
      toJSON: jest.fn(() => ({ ...mockPurchasedMaterial.dataValues })),
    };

    PurchasedMaterial.findByPk.mockResolvedValue(mockPurchasedMaterial);

    await purchasedMaterialController.updatePurchasedMaterial(req, res);

    expect(mockPurchasedMaterial.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      PurchasedMaterialId: 1,
      SaleMaterialId: 2,
      PurchaserId: 1,
      PurchasedDate: '2023-10-01T00:00:00Z',
    });
    expect(mockPurchasedMaterial.toJSON).toHaveBeenCalled();
  });

  test('deletePurchasedMaterial should remove a purchased material', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockPurchasedMaterial = { destroy: jest.fn().mockResolvedValue(1) };

    PurchasedMaterial.findByPk.mockResolvedValue(mockPurchasedMaterial);

    await purchasedMaterialController.deletePurchasedMaterial(req, res);

    expect(mockPurchasedMaterial.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getPurchasedMaterialById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    PurchasedMaterial.findByPk.mockResolvedValue(null);

    await purchasedMaterialController.getPurchasedMaterialById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'PurchasedMaterial not found' });
  });

  test('searchPurchasedMaterials should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { startDate: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    PurchasedMaterial.findAll.mockResolvedValue([]);

    await purchasedMaterialController.searchPurchasedMaterials(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No purchased materials found matching the criteria.' });
  });
});