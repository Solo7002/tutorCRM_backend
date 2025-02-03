const httpMocks = require('node-mocks-http');
const { SaleMaterialFile } = require('../../../src/models/dbModels');
const saleMaterialFileController = require('../../../src/controllers/dbControllers/saleMaterialFileController');
const { Op } = require('sequelize');

jest.mock('../../../src/models/dbModels', () => ({
  SaleMaterialFile: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

describe('SaleMaterialFile Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('createSaleMaterialFile should create a new sale material file', async () => {
    const req = httpMocks.createRequest({
      method: 'POST',
      body: {
        FilePath: 'http://example.com/file.pdf',
        FileName: 'Math Notes',
        SaleMaterialId: 1,
        PurchasedMaterialId: 1,
      },
    });
    const res = httpMocks.createResponse();

    SaleMaterialFile.create.mockResolvedValue(req.body);

    await saleMaterialFileController.createSaleMaterialFile(req, res);

    expect(SaleMaterialFile.create).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toEqual(req.body);
  });

  test('getSaleMaterialFiles should return all sale material files', async () => {
    const req = httpMocks.createRequest({ method: 'GET' });
    const res = httpMocks.createResponse();

    const mockSaleMaterialFiles = [
      {
        SaleMaterialFileId: 1,
        FilePath: 'http://example.com/file.pdf',
        FileName: 'Math Notes',
        AppearedDate: '2023-10-01T00:00:00Z',
        SaleMaterialId: 1,
        PurchasedMaterialId: 1,
      },
    ];

    SaleMaterialFile.findAll.mockResolvedValue(mockSaleMaterialFiles);

    await saleMaterialFileController.getSaleMaterialFiles(req, res);

    expect(SaleMaterialFile.findAll).toHaveBeenCalledWith({
      where: undefined,
      order: undefined,
    });
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSaleMaterialFiles);
  });

  test('getSaleMaterialFileById should return sale material file if found', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSaleMaterialFile = {
      SaleMaterialFileId: 1,
      FilePath: 'http://example.com/file.pdf',
      FileName: 'Math Notes',
      AppearedDate: '2023-10-01T00:00:00Z',
      SaleMaterialId: 1,
      PurchasedMaterialId: 1,
    };

    SaleMaterialFile.findByPk.mockResolvedValue(mockSaleMaterialFile);

    await saleMaterialFileController.getSaleMaterialFileById(req, res);

    expect(SaleMaterialFile.findByPk).toHaveBeenCalledWith(1);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(mockSaleMaterialFile);
  });

  test('searchSaleMaterialFiles should return matching sale material files', async () => {
    const req = httpMocks.createRequest({
      method: 'GET',
      query: {
        fileName: 'Math',
        startDate: '2023-10-01',
        endDate: '2023-10-31',
        saleMaterialId: '1',
        purchasedMaterialId: '1',
      },
    });
    const res = httpMocks.createResponse();

    const mockSaleMaterialFiles = [
      {
        SaleMaterialFileId: 1,
        FilePath: 'http://example.com/file.pdf',
        FileName: 'Math Notes',
        AppearedDate: '2023-10-15T00:00:00Z',
        SaleMaterialId: 1,
        PurchasedMaterialId: 1,
      },
    ];

    SaleMaterialFile.findAll.mockResolvedValue(mockSaleMaterialFiles);

    await saleMaterialFileController.searchSaleMaterialFiles(req, res);

    expect(SaleMaterialFile.findAll).toHaveBeenCalledWith({
      where: {
        FileName: { [Op.like]: '%Math%' },
        AppearedDate: { [Op.between]: [new Date('2023-10-01'), new Date('2023-10-31')] },
        SaleMaterialId: '1',
        PurchasedMaterialId: '1',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().success).toBe(true);
    expect(res._getJSONData().data).toEqual(mockSaleMaterialFiles);
  });

  test('updateSaleMaterialFile should update an existing sale material file', async () => {
    const req = httpMocks.createRequest({
      method: 'PUT',
      params: { id: 1 },
      body: { FileName: 'Updated Math Notes' },
    });
    const res = httpMocks.createResponse();

    const mockSaleMaterialFile = {
      update: jest.fn().mockResolvedValue([1]),
      dataValues: {
        SaleMaterialFileId: 1,
        FilePath: 'http://example.com/file.pdf',
        FileName: 'Updated Math Notes',
        AppearedDate: '2023-10-01T00:00:00Z',
        SaleMaterialId: 1,
        PurchasedMaterialId: 1,
      },
      toJSON: jest.fn(() => ({ ...mockSaleMaterialFile.dataValues })),
    };

    SaleMaterialFile.findByPk.mockResolvedValue(mockSaleMaterialFile);

    await saleMaterialFileController.updateSaleMaterialFile(req, res);

    expect(mockSaleMaterialFile.update).toHaveBeenCalledWith(req.body);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual({
      SaleMaterialFileId: 1,
      FilePath: 'http://example.com/file.pdf',
      FileName: 'Updated Math Notes',
      AppearedDate: '2023-10-01T00:00:00Z',
      SaleMaterialId: 1,
      PurchasedMaterialId: 1,
    });
    expect(mockSaleMaterialFile.toJSON).toHaveBeenCalled();
  });

  test('deleteSaleMaterialFile should remove a sale material file', async () => {
    const req = httpMocks.createRequest({ method: 'DELETE', params: { id: 1 } });
    const res = httpMocks.createResponse();

    const mockSaleMaterialFile = { destroy: jest.fn().mockResolvedValue(1) };

    SaleMaterialFile.findByPk.mockResolvedValue(mockSaleMaterialFile);

    await saleMaterialFileController.deleteSaleMaterialFile(req, res);

    expect(mockSaleMaterialFile.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(204);
  });

  test('getSaleMaterialFileById should handle not found case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', params: { id: 999 } });
    const res = httpMocks.createResponse();

    SaleMaterialFile.findByPk.mockResolvedValue(null);

    await saleMaterialFileController.getSaleMaterialFileById(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ error: 'SaleMaterialFile not found' });
  });

  test('searchSaleMaterialFiles should handle no results case', async () => {
    const req = httpMocks.createRequest({ method: 'GET', query: { fileName: 'Nonexistent' } });
    const res = httpMocks.createResponse();

    SaleMaterialFile.findAll.mockResolvedValue([]);

    await saleMaterialFileController.searchSaleMaterialFiles(req, res);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toEqual({ success: false, message: 'No sale material files found matching the criteria.' });
  });
});